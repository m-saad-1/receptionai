export const db = {
  conversations: [] as any[],
  leads: [] as any[],
  configs: [] as any[]
};

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export const ConversationMock = {
  findById: async (id: string) => {
    const doc = db.conversations.find((c) => c._id === id || c.id === id);
    if (!doc) return null;
    return {
      ...doc,
      save: async function() {
        Object.assign(doc, this);
        return this;
      }
    };
  },
  countDocuments: async () => db.conversations.length,
};

export const ConversationModelMock = function(data: any) {
  this._id = generateId();
  this.id = this._id;
  this.messages = [];
  this.messageCount = 0;
  Object.assign(this, data);
  this.save = async () => {
    db.conversations.push(this);
    return this;
  };
} as any;

Object.assign(ConversationModelMock, ConversationMock);

export const LeadMock = {
  findOne: async (query: any) => {
    return db.leads.find(l => String(l.conversationId) === String(query.conversationId)) || null;
  },
  findOneAndUpdate: async (query: any, update: any, options: any) => {
    let lead = db.leads.find(l => String(l.conversationId) === String(query.conversationId));
    if (!lead) {
      if (options.upsert) {
        lead = { _id: generateId(), conversationId: query.conversationId };
        db.leads.push(lead);
      } else {
        return null;
      }
    }
    // Handle mongoose $set syntax in the mock
    const updateData = update.$set ? update.$set : update;
    Object.assign(lead, updateData);
    return lead;
  },
  find: () => {
    const items = [...db.leads];
    return {
      sort: () => ({
        populate: () => items
      })
    };
  },
  countDocuments: async (query: any) => {
    if (query && query.contactName) {
      return db.leads.filter(l => !!l.contactName).length;
    }
    return db.leads.length;
  }
};

export const BusinessConfigMock = {
  countDocuments: async () => db.configs.length,
  insertMany: async (data: any[]) => { db.configs.push(...data); },
  deleteMany: async () => { db.configs = []; },
  find: async () => db.configs,
};
