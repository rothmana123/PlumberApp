# External APIs for Real Plumber Data

This guide shows you how to integrate with popular business APIs to get real plumber data instead of using sample data.

## Available APIs

### 1. **Yelp Fusion API** ⭐ (Recommended)

- **Cost**: Free tier (500 requests/day)
- **Data**: Business info, ratings, reviews, location, hours
- **Pros**: Comprehensive data, good documentation, reliable
- **Cons**: Rate limited on free tier

### 2. **Google Places API**

- **Cost**: $200/month free credit, then pay-per-use
- **Data**: Business details, ratings, photos, location, hours
- **Pros**: Very accurate data, includes photos, comprehensive
- **Cons**: More expensive, complex pricing structure

### 3. **Foursquare Places API**

- **Cost**: Free tier available
- **Data**: Business listings, tips, check-ins, location
- **Pros**: Good for location-based data, social features
- **Cons**: Less comprehensive than Yelp/Google

## Yelp API Integration (Implemented)

### Setup Instructions

1. **Get Yelp API Key**:

   - Go to [Yelp Developers](https://www.yelp.com/developers)
   - Sign up for a developer account
   - Create a new app
   - Copy your API key

2. **Configure Environment**:

   ```bash
   # Add to your .env.local file
   VITE_YELP_API_KEY=your_yelp_api_key_here
   ```

3. **Use the Integration**:
   - Click "Show Yelp Integration" in your app
   - Click "Fetch & Sync" to get real plumber data
   - Data will be automatically synced to your database

### What Data You Get

- **Business Information**: Name, phone, address, website
- **Ratings & Reviews**: Star ratings, review counts
- **Location Data**: Coordinates, neighborhoods
- **Categories**: Plumbing specialties
- **Pricing**: Price levels ($, $$, $$$, $$$$)
- **Hours**: Operating hours, emergency availability
- **Photos**: Business images

### API Limits

- **Free Tier**: 500 requests/day
- **Paid Plans**: Starting at $49/month for 25,000 requests

## Implementation Examples

### Yelp Search (Already Implemented)

```typescript
// Search for plumbers in San Francisco
const plumbers = await searchSFPlumbers("emergency", {
  neighborhood: "Mission District",
  maxPrice: "$$",
  minRating: 4.5,
});
```

## Best Practices

### 1. **Rate Limiting**

- Implement request throttling
- Cache results when possible
- Monitor API usage

### 2. **Error Handling**

- Handle API failures gracefully
- Provide fallback to sample data
- Log errors for debugging

### 3. **Data Caching**

- Cache API responses in your database
- Update data periodically
- Avoid repeated API calls

## Recommended Approach

1. **Start with Yelp**: Free tier, good data, easy integration
2. **Cache Results**: Store data in your database to reduce API calls
3. **Monitor usage**: Track API calls and costs

## Troubleshooting

### Common Issues

**"API key not configured"**

- Check your `.env.local` file
- Verify the API key is correct
- Restart your development server

**"Rate limit exceeded"**

- Wait for rate limit to reset
- Implement request throttling
- Consider upgrading to paid plan

**"No results found"**

- Check your search parameters
- Verify the location is correct
- Try broader search terms
