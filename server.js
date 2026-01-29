require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

// Initialize Microsoft Graph client
function getGraphClient() {
    const credential = new ClientSecretCredential(
        process.env.TENANT_ID,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });

    return Client.initWithMiddleware({ authProvider });
}

// Get SharePoint Site ID
async function getSiteId(client) {
    // If SHAREPOINT_SITE_NAME is empty, get root site; otherwise get subsite
    const sitePath = process.env.SHAREPOINT_SITE_NAME 
        ? `/sites/${process.env.SHAREPOINT_HOST}:/sites/${process.env.SHAREPOINT_SITE_NAME}`
        : `/sites/${process.env.SHAREPOINT_HOST}`;
    
    const site = await client.api(sitePath).get();
    return site.id;
}

// Get List ID by name
async function getListId(client, siteId, listName) {
    const lists = await client.api(`/sites/${siteId}/lists`)
        .filter(`displayName eq '${listName}'`)
        .get();
    
    if (lists.value.length === 0) {
        throw new Error(`List "${listName}" not found`);
    }
    return lists.value[0].id;
}

// API endpoint to fetch Event Itinerary list items
app.get('/api/events', async (req, res) => {
    try {
        const client = getGraphClient();
        
        // Get site ID
        const siteId = await getSiteId(client);
        console.log('Site ID:', siteId);
        
        // Get list ID
        const listId = await getListId(client, siteId, process.env.LIST_NAME);
        console.log('List ID:', listId);
        
        // Fetch list items with all fields
        const items = await client.api(`/sites/${siteId}/lists/${listId}/items`)
            .expand('fields')
            .get();
        
        // Extract just the fields data for cleaner response
        const events = items.value.map(item => ({
            id: item.id,
            ...item.fields
        }));
        
        res.json({
            success: true,
            count: events.length,
            data: events,
            lastFetched: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 API endpoint: http://localhost:${PORT}/api/events`);
    console.log(`🌐 Open http://localhost:${PORT} to view the demo\n`);
});
