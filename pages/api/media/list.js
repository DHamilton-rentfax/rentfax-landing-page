// pages/api/media/list.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await s3
      .listObjectsV2({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: 'uploads/',
      })
      .promise();

    const items = response.Contents.map((item) => ({
      key: item.Key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
      lastModified: item.LastModified,
    }));

    res.status(200).json({ media: items });
  } catch (err) {
    console.error('[S3 MEDIA LIST ERROR]', err);
    res.status(500).json({ error: 'Failed to list media' });
  }
}
