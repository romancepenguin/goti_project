from pyspark import SparkContext, SparkConf
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.recommendation import ALS
from pyspark.sql.functions import udf
from pyspark.sql.types import IntegerType, ArrayType, StringType
from pyspark.sql.functions import monotonically_increasing_id
from pyspark.sql import SQLContext, SparkSession


spark = SparkSession.builder.master("local").appName("Word Count").config("spark.some.config.option", "some-value").getOrCreate()

df = spark.read.format("com.mongodb.spark.sql.DefaultSource").option("uri","mongodb://root:1234@127.0.0.1:27017/goti.comments?authSource=admin").load()

df_mapping = df.groupby("object_u_id").agg({"score": "avg"})
df_mapping = df_mapping.coalesce(1).withColumn("u_no",monotonically_increasing_id())
df = df.join(df_mapping,"object_u_id")

df_mapping_facility = df.groupby("f_id").agg({"score": "avg"})
df_mapping_facility = df_mapping_facility.coalesce(1).withColumn("f_no",monotonically_increasing_id())
df = df.join(df_mapping_facility,"f_id")
df = df.select("u_no" ,"score", "f_no")


als = ALS(maxIter=5, regParam=0.01, userCol="u_no", itemCol="f_no", ratingCol="score", coldStartStrategy="drop")
model = als.fit(df)

userRecs = model.recommendForAllUsers(10)

userRecs = userRecs.join(df_mapping,"u_no")
userRecs = userRecs.drop("u_no")
userRecs = userRecs.drop("avg(score)")

mapping_book = df_mapping_facility.collect()

def convert(column):
	res=[]
	for x in column:
		r=""
		for i in mapping_book:
			if(x[0]==i[2]):
				r=i[0][0]
				break
		res.append([r,x[1]])
	return res

mapping_facility = udf(lambda x:convert(x), ArrayType(StringType()))
userRecs = userRecs.withColumn("recommendations",mapping_facility(userRecs["recommendations"]))

convertType = udf(lambda x:x[0],StringType())
userRecs = userRecs.withColumn("object_u_id",convertType(userRecs["object_u_id"]))


userRecs.write.format("com.mongodb.spark.sql.DefaultSource").mode("append").option("uri","mongodb://root:1234@127.0.0.1:27017/goti?authSource=admin").option("collection", "facility_recommend_cb").save()
