import { ApolloServer,gql } from "apollo-server";
 

const typeDefs = gql`
type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
}
type Tweet {
    id:ID!
    text:String!
    author: User!
}
type Query {
  allTwees: [Tweet!]!
  tweet(id: ID):Tweet
}
type Mutation {
    postTweet(text:String!,userId: ID!): Tweet!
    deleteTweet(id:ID!): Boolean!
}
`;

const resolvers={
    Query : {
        tweet : ()=>{
            console.log("im called");
            return null;
        }
    }
}


const server  = new ApolloServer({typeDefs,resolvers});


server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
})