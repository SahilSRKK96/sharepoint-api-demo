require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

// Cache site and list IDs
let siteId = null;
let listId = null;

// Get SharePoint Site ID
async function getSiteId(client) {
    if (siteId) return siteId;

    const sitePath = process.env.SHAREPOINT_SITE_NAME
        ? `/sites/${process.env.SHAREPOINT_HOST}:/sites/${process.env.SHAREPOINT_SITE_NAME}`
        : `/sites/${process.env.SHAREPOINT_HOST}`;

    const site = await client.api(sitePath).get();
    siteId = site.id;
    return siteId;
}

// Get List ID
async function getListId(client, siteId) {
    if (listId) return listId;

    const lists = await client.api(`/sites/${siteId}/lists`)
        .filter(`displayName eq '${process.env.LIST_NAME}'`)
        .get();

    if (lists.value.length === 0) {
        throw new Error(`List "${process.env.LIST_NAME}" not found`);
    }
    listId = lists.value[0].id;
    return listId;
}

// GET - Fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const client = getGraphClient();
        const siteId = await getSiteId(client);
        const listId = await getListId(client, siteId);

        const items = await client.api(`/sites/${siteId}/lists/${listId}/items`)
            .expand('fields')
            .get();

        const users = items.value.map(item => ({
            id: item.id,
            odataEtag: item.fields['@odata.etag'],
            userId: item.fields.Title,
            name: item.fields.Name,
            status: item.fields.Status,
            group: item.fields.Group,
            updatedDate: item.fields.Modified,
            createdDate: item.fields.Created
        }));

        res.json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET - Fetch single user
app.get('/api/users/:id', async (req, res) => {
    try {
        const client = getGraphClient();
        const siteId = await getSiteId(client);
        const listId = await getListId(client, siteId);

        const item = await client.api(`/sites/${siteId}/lists/${listId}/items/${req.params.id}`)
            .expand('fields')
            .get();

        const user = {
            id: item.id,
            userId: item.fields.Title,
            name: item.fields.Name,
            status: item.fields.Status,
            group: item.fields.Group,
            updatedDate: item.fields.Modified,
            createdDate: item.fields.Created
        };

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST - Create new user
app.post('/api/users', async (req, res) => {
    try {
        const { userId, name, status, group } = req.body;

        if (!userId || !name) {
            return res.status(400).json({
                success: false,
                error: 'userId and name are required'
            });
        }

        const client = getGraphClient();
        const siteId = await getSiteId(client);
        const listId = await getListId(client, siteId);

        const newItem = await client.api(`/sites/${siteId}/lists/${listId}/items`)
            .post({
                fields: {
                    Title: userId,
                    Name: name,
                    Status: status || 'Active',
                    Group: group || ''
                }
            });

        res.status(201).json({
            success: true,
            data: {
                id: newItem.id,
                userId: userId,
                name: name,
                status: status || 'Active',
                group: group || ''
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// PATCH - Update user
app.patch('/api/users/:id', async (req, res) => {
    try {
        const { userId, name, status, group } = req.body;

        const client = getGraphClient();
        const siteId = await getSiteId(client);
        const listId = await getListId(client, siteId);

        const fields = {};
        if (userId !== undefined) fields.Title = userId;
        if (name !== undefined) fields.Name = name;
        if (status !== undefined) fields.Status = status;
        if (group !== undefined) fields.Group = group;

        await client.api(`/sites/${siteId}/lists/${listId}/items/${req.params.id}/fields`)
            .patch(fields);

        res.json({
            success: true,
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE - Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const client = getGraphClient();
        const siteId = await getSiteId(client);
        const listId = await getListId(client, siteId);

        await client.api(`/sites/${siteId}/lists/${listId}/items/${req.params.id}`)
            .delete();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\nKTMB Backend running at http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  GET    /api/users     - List all users`);
    console.log(`  GET    /api/users/:id - Get single user`);
    console.log(`  POST   /api/users     - Create user`);
    console.log(`  PATCH  /api/users/:id - Update user`);
    console.log(`  DELETE /api/users/:id - Delete user\n`);
});
