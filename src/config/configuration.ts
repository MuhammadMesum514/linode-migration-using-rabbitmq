export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  s3: {
    endpoint: `https://${process.env.LINODE_S3_HOSTNAME}`,
    accessKeyId: process.env.LINODE_S3_ACCESS_KEY,
    secretAccessKey: process.env.LINODE_S3_SECRET_KEY,
    bucketName: process.env.LINODE_S3_BUCKET_NAME,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    queue: 'file_migration_queue',
    image_queue: 'question_image_migration_queue',
  },
  batchSize: parseInt(process.env.BATCH_SIZE, 10) || 100,
});
