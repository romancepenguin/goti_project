'''
--packages org.mongodb.spark:mongo-spark-connector_2.11:2.2.0
'''

from pyspark.sql.functions import col,size
from pyspark.sql.types import StringType, IntegerType, BooleanType, StructType, ByteType, StructField
from pyspark.sql.functions import udf
from pyspark.sql import functions as F
from pyspark.sql import SparkSession, SQLContext
from pyspark.ml.fpm import FPGrowth
from pyspark.sql.functions import monotonically_increasing_id
from bson.objectid import ObjectId

spark = SparkSession.builder.master("local").appName("Word Count").config("spark.some.config.option", "some-value").getOrCreate()

df = spark.read.format("com.mongodb.spark.sql.DefaultSource").option("uri","mongodb://root:1234@127.0.0.1:27017/goti.order_items?authSource=admin").load()
df_facility = spark.read.format("com.mongodb.spark.sql.DefaultSource").option("uri","mongodb://root:1234@127.0.0.1:27017/goti.facilities?authSource=admin").load()
df_facility = df_facility.select(col("_id").alias("f_id"), col("adr"))

'''
#content_base 적용
df = df.join(df_facility,"f_id")
si_gun_goo="강남구"
def adr_check(column):
	if(si_gun_goo==column[2]):
		return True
	else:
		return False

content_base = udf(lambda x:True if adr_check(x) else False,BooleanType())
df = df.where(content_base(col("adr")))
'''

'''
#한꺼번에 분석 실시
si_gun_goo_list=["강남구","양재동",....]
for si_gun_goo in :si_gun_goo_list:
	df = spark.read.format("com.mongodb.spark.sql.DefaultSource").option("uri","mongodb://127.0.0.1/goti.order_items").load()
	content_base = udf(lambda x:True if adr_check(x) else False,BooleanType())
	df = df.where(content_base(col("adr")))
	
	분석시작 ....	
'''
#매핑용 테이블 생성
df_facility = spark.read.format("com.mongodb.spark.sql.DefaultSource").option("uri","mongodb://root:1234@127.0.0.1:27017/goti.facilities?authSource=admin").load()
df_facility = df_facility.select("_id")
df_facility = df_facility.coalesce(1).withColumn("no",monotonically_increasing_id())
convertType = udf(lambda x:x[0],StringType())
df_facility = df_facility.withColumn("f_id",convertType(df_facility["_id"]))
df_facility = df_facility.drop("_id")
########

#use_count가 0이상인 것만 가져와야 합니다.
df = df.where(size(col("use_date"))>0)
df = df.select("f_id","use_date","object_u_id")

#use_date속성을 풀어줍니다.
rdd = df.rdd
def extract(row, key):
	_dict = row.asDict()
	_list = _dict[key]
	return (_dict, _list)

def add_to_dict(_dict, key, value):
	_dict[key] = value
	return _dict

rdd = rdd.map(lambda x:extract(x,'use_date'))
rdd = rdd.flatMapValues(lambda x:x)
rdd = rdd.map(lambda x: add_to_dict(x[0], 'use_date', x[1]))
sqlContext = SQLContext(spark)
df = sqlContext.createDataFrame(rdd)
#####


convertType = udf(lambda x:x[1],StringType())
df = df.withColumn("use_date",convertType(df["use_date"]))

convertType = udf(lambda x:x[0],StringType())
df = df.withColumn("f_id",convertType(df["f_id"]))
df = df.withColumn("object_u_id",convertType(df["object_u_id"]))
df = df.dropDuplicates(['f_id','object_u_id','use_date'])

df = df.join(df_facility,"f_id")

#그룹으로 묶기
df = df.groupby("object_u_id","use_date").agg(F.collect_list("no"))
df = df.select(col("collect_list(no)").alias("items"))
df = df.where(size(col("items"))>1) #1개 짜리는 연관성 없으니 삭제합니다.

fpGrowth = FPGrowth(itemsCol="items", minSupport=0.005, minConfidence=0.005)
model = fpGrowth.fit(df)

# Display generated association rules.
df_confidence = model.associationRules
df_confidence = df_confidence.where(size(col("antecedent"))<2)

df_confidence = df_confidence.withColumn("antecedent",convertType(df_confidence["antecedent"]))
df_confidence = df_confidence.withColumn("consequent",convertType(df_confidence["consequent"]))

###매핑한 f_id 다시 처리
#df_confidence = df_confidence.select(col("antecedent").alias("f_id"), col("consequent").alias("f_id"), col("confidence"))
#df_confidence = df_confidence.join(df_facility,"f_id")
df_confidence = df_confidence.join(df_facility, df_confidence.antecedent == df_facility.no, 'inner')
df_confidence = df_confidence.select(col("f_id").alias("antecedent"), col("consequent"), col("confidence"))
df_confidence = df_confidence.join(df_facility, df_confidence.consequent == df_facility.no, 'inner')
df_confidence = df_confidence.select(col("f_id").alias("consequent"), col("antecedent"), col("confidence"))


from pyspark.sql.functions import desc
df_confidence = df_confidence.orderBy(desc("confidence"), "consequent")
df_confidence = df_confidence.groupby("antecedent").agg(F.collect_list("consequent"))
#collect_set 중복 제거 가능

#df_confidence = df_confidence.groupby("antecedent").agg(F.collect_list("consequent"))
df_confidence = df_confidence.select(col("antecedent"), col("collect_list(consequent)").alias("consequent"))

#overwrite
df_confidence.write.format("com.mongodb.spark.sql.DefaultSource").mode("append").option("uri","mongodb://root:1234@127.0.0.1:27017/goti?authSource=admin").option("collection", "facility_recommend_fp").save()
