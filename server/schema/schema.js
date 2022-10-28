const {
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLEnumType
} = require('graphql');

const Project = require("../models/project")
const Client = require("../models/client");

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
});

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLBoolean },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId)
      }
    }
  })
});

const StatusType = new GraphQLEnumType({
  name: "ProjectStatus",
  values: {
    "new": { value: "Not Started" },
    "progress": { value: "In Progress" },
    "complated": { value: "Complated" },
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // client
    createClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Client.create({
          name: args.name,
          email: args.email,
          password: args.password,
          phone: args.phone
        })
      }
    },
    updateClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Client.findByIdAndUpdate(args.id, {
          name: args.name,
          email: args.email,
          password: args.password,
          phone: args.phone
        })
      }
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id)
      }
    },
    // project
    createProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: StatusType,
          defaultValue: "Not Started"
        },
        clientId: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return Project.create({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId
        })
      }
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: StatusType,
          defaultValue: "Not Started"
        },
        clientId: {
          type: GraphQLID
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(args.id, {
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId
        })
      }
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Project.findByIdAndDelete(args.id)
      }
    }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Project.findById(args.id)
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      async resolve(parent, args) {
        return await Project.find();
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Client.findById(args.id)
      }
    },
    clients: {
      type: new GraphQLList(ClientType),
      async resolve(parent, args) {
        return await Client.find();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation
})