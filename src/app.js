import { ApolloServer,gql } from "apollo-server";
 
const users=[{
        id:"1",
        firstName:"정",
        lastName:"영석"
    },
    {
        id:"2",
        firstName:"Elton",
        lastName:"Jhon"
    }
]
let tweets=[
    {
        id:"1",
        text:"first one"        
    },
    {
        id:"2",
        text:"second one"
    }

]

const typeDefs = gql`
type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    fullName: String!
}
type Tweet {
    id:ID!
    text:String!
    author: User
}
type Query {
  allTweets: [Tweet!]!
  tweet(id: ID):Tweet
  allUsers: [User!]!
}
type Mutation {
    postTweet(text:String!,userId: ID!): Tweet!
    deleteTweet(id:ID!): Boolean!
}
`;

const resolvers={
    Query : {
        allTweets : ()=>{
            return tweets;
        },
        tweet : (_,{id})=>{
            return tweets.find(tweet=>tweet.id === id)
        },
        allUsers: ()=>{
            return users;
        }
    },
    Mutation : {
        postTweet : (_, {text,userId})=>{
            const newTweet={
                id : tweets.length+1,
                text,
            };
            tweets.push(newTweet);

            return newTweet;
        },
        deleteTweet:(_,{id})=>{

            const tweet = tweets.find((tweet)=> tweet.id === id);
            if(!tweet) return false;
            tweets = tweets.filter(tweet=> tweet.id !== id);
            return true
        },
    },
    User:{
        fullName:({firstName,lastName})=>{
            console.log("fullName Called");
            //console.log(root);
            return firstName+' '+lastName;
        }
    }
}


const server  = new ApolloServer({typeDefs,resolvers});


server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
})