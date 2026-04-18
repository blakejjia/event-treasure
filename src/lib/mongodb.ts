import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

export default client;

export interface EventDocument {
  _id: string;
  is_event: boolean;
  event: {
    title: string | null;
    has_free_food: boolean | null;
    event_start: string | null;
    event_end: string | null;
    event_date_text: string | null;
    location_name: string | null;
    location_details: string | null;
  } | null;
  special_notes: {
    is_religious_activity: boolean | null;
    tags: string[];
    notes: string;
  };
  confidence: number;
  caption: string;
  displayUrl: string;
  post_time: string;
  url: string;
  width?: number;
  height?: number;
}

export async function getEvents(): Promise<EventDocument[]> {
  try {
    const dbClient = await client.connect();
    const db = dbClient.db('default');
    const collection = db.collection<EventDocument>('event_treasure');
    
    // Fetch all events including non-events
    const eventsCursor = collection.find({});
    
    // Sort logically if we want (e.g. maybe post_time descending or event_start ascending? Let's just fetch for now and transform)
    const events = await eventsCursor.sort({ post_time: -1 }).toArray();
    
    // We need to map _id from ObjectId to string so it can be passed to Client Components
    return events.map(e => ({
      ...e,
      _id: e._id.toString()
    })) as EventDocument[];
    
  } catch (e) {
    console.error(e);
    return [];
  }
}
