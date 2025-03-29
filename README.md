# Report Generator

This project takes some manual inputs and generates a report for teaching activities and professional development activities (PDA).

## Cloudinary Integration

This project uses Cloudinary for image storage and optimization. Follow these steps to set up Cloudinary for your project:

1. **Create a Cloudinary account** at https://cloudinary.com/ (free tier available)

2. **Set up environment variables**:
   - Add your Cloudinary credentials to the `.env` file in your backend directory:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Create an Upload Preset**:
   - Go to Settings > Upload in your Cloudinary console
   - Create an "Unsigned" upload preset named "report_generator"
   - This allows frontend uploads without exposing your API secret

4. **Usage**:
   - The application automatically uploads images to Cloudinary
   - Chart images are stored in the "report_charts" folder
   - Regular images are stored in the "report_images" folder
   - PDFs use Cloudinary URLs instead of base64 strings for better performance

## Getting Started

1. **Clone this repository**

2. **Install dependencies**:
   ```
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up MongoDB** - Ensure MongoDB is running on your local machine (default: mongodb://127.0.0.1:27017/report-generator)

4. **Start the backend**:
   ```
   cd backend && npm start
   ```

5. **Start the frontend**:
   ```
   cd frontend && npm run dev
   ```

6. **Open the application** in your browser at http://localhost:5173
