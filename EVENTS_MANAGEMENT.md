# Events Management Guide

## How to Add Events to the Care Resources App Calendar

The Care Resources app has a dynamic events system that pulls from AWS DynamoDB. Here's how to manage events:

## Method 1: AWS Console (Recommended)

### Step 1: Access AWS DynamoDB
1. Go to [AWS Console](https://aws.amazon.com/console/) 
2. Navigate to **DynamoDB** → **Tables** → **expat-events**

### Step 2: Add New Event
1. Click **"Create item"**
2. Add the following fields:

```json
{
  "id": "event-001",
  "title": "Monthly Care Team Meeting",
  "date": "2024-02-15",
  "time": "3:00 PM EST",
  "location": "Virtual - Zoom",
  "description": "Monthly gathering for care team members to discuss current initiatives and support strategies.",
  "type": "meeting",
  "registrationUrl": "https://zoom.us/j/123456789",
  "isVirtual": true,
  "category": "Care Team"
}
```

### Required Fields:
- **id**: Unique identifier (e.g., "event-001", "event-002")  
- **title**: Event name
- **date**: Format: YYYY-MM-DD
- **time**: Human readable time (e.g., "3:00 PM EST")
- **location**: Where the event takes place
- **description**: Brief event description

### Optional Fields:
- **type**: "webinar", "conference", "workshop", "meeting", "social"
- **registrationUrl**: Link for event registration
- **isVirtual**: true/false
- **category**: Event category for filtering
- **image**: URL to event image

## Method 2: AWS CLI (For Bulk Operations)

```bash
# Add single event
aws dynamodb put-item \
  --table-name expat-events \
  --item '{
    "id": {"S": "event-001"},
    "title": {"S": "Care Team Meeting"},
    "date": {"S": "2024-02-15"},
    "time": {"S": "3:00 PM EST"},
    "location": {"S": "Virtual - Zoom"},
    "description": {"S": "Monthly care team meeting"},
    "type": {"S": "meeting"},
    "registrationUrl": {"S": "https://zoom.us/j/123456789"},
    "isVirtual": {"BOOL": true},
    "category": {"S": "Care Team"}
  }'
```

## Event Display in App

Events automatically appear in the **Events tab** (formerly Community) with:
- Event title and date
- Time and location with icons
- Brief description
- Registration link (if provided)
- Tap to register functionality

## API Endpoint

The app fetches events from:
```
https://3hggeubhb5.execute-api.us-east-1.amazonaws.com/prod/events
```

Events are cached for 30 minutes and automatically refresh.

## Event Status

- **Future events**: Automatically displayed in chronological order
- **Past events**: Automatically filtered out
- **Registration**: Tapping an event with registrationUrl opens the link

## Best Practices

1. **Consistent Dating**: Always use YYYY-MM-DD format
2. **Clear Titles**: Keep titles descriptive but concise
3. **Registration Links**: Include registration URLs when applicable
4. **Categories**: Use consistent category names for filtering
5. **Virtual Events**: Mark virtual events appropriately

## Troubleshooting

- **Events not showing**: Check date format and ensure future dates
- **Registration not working**: Verify registrationUrl is complete URL
- **App not updating**: Events cache refreshes every 30 minutes

## Sample Events

```json
[
  {
    "id": "webinar-001",
    "title": "Mental Health in Ministry",
    "date": "2024-02-20",
    "time": "7:00 PM EST",
    "location": "Virtual Webinar",
    "description": "Exploring mental health challenges and resources for international servants.",
    "type": "webinar",
    "registrationUrl": "https://example.com/register",
    "isVirtual": true,
    "category": "Mental Health"
  },
  {
    "id": "conference-001", 
    "title": "Annual Care Conference",
    "date": "2024-03-15",
    "time": "9:00 AM - 5:00 PM",
    "location": "Springfield, MO",
    "description": "Annual gathering of care coordinators and support staff.",
    "type": "conference",
    "registrationUrl": "https://example.com/conference",
    "isVirtual": false,
    "category": "Conference"
  }
]
```

## Contact

For technical support with events management, contact your app administrator.