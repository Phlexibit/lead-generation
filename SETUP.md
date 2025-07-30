# Date Filtering Setup Guide

## Quick Setup Steps

### 1. Backend Setup
```bash
cd fastify-backend-outbound_stage/fastify-backend-outbound_stage
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/lead_generation_db
PORT=8001
JWT_SECRET=dev-secret-key
JWT_TOKEN_EXPIRY=24h
REFRESH_TOKEN_SECRET=dev-refresh-secret
ELEVENLABS_API_KEY=dummy-key
ELEVENLABS_AGENT_ID_HINDI_LAVISH=dummy-id
ELEVENLABS_AGENT_ID_HINDI_ARISE=dummy-id
TWILIO_ACCOUNT_SID=dummy-sid
TWILIO_AUTH_TOKEN=dummy-token
TWILIO_PHONE_NUMBER=+1234567890
MAKE_WEBHOOK_URL=https://dummy-webhook.com
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd lead-generation-master/lead-generation-master
npm run dev
```

### 3. Test the System

1. **Test Backend**: Open `test-backend.html` in your browser
2. **Test Frontend**: Go to `/leads` or `/site-visits` pages
3. **Use Date Filter**: 
   - Click "Quick Filters" dropdown
   - Select date presets (Today, Yesterday, etc.)
   - Or manually enter start/end dates
   - See filtered results

## Features Available

✅ **Date Range Picker**: Manual start/end date selection
✅ **Quick Filters**: Today, Yesterday, This Week, This Month, Last Month, Last 7 Days, Last 30 Days
✅ **Visual Indicators**: Shows active filter range
✅ **Filter Summary**: Displays result count
✅ **Clear Filters**: Easy way to reset filters

## Troubleshooting

If date filtering doesn't work:

1. **Check Backend**: Ensure server is running on port 8001
2. **Check Database**: Ensure MongoDB is running
3. **Check Console**: Look for JavaScript errors
4. **Test API**: Use the test-backend.html file
5. **Check Project**: Ensure a project is selected in the dropdown

## API Endpoints

- `GET /api/leads?projectId=X&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `GET /api/site-visits?projectId=X&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

The system is now ready to use!