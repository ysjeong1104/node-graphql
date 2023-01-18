import { ApolloServer,gql } from "apollo-server";
import fetch from "node-fetch";

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
        text:"first one",
        userId:"1" 
    },
    {
        id:"2",
        text:"second one",
        userId:"2"
    }

]

const typeDefs = gql`
type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName
    """
    fullName: String!
}
"""
Tweet object represents a resource for a tweet
"""
type Tweet {
    id:ID!
    text:String!
    author: User
}
type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
}
type Query {
  allTweets: [Tweet!]!
  tweet(id: ID):Tweet
  allUsers: [User!]!
  allMovies: [Movie!]!
  movie(id: ID): Movie!
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
        },
        allMovies: async ()=>{
            const movies = await (await fetch("https://yts.mx/api/v2/list_movies.json",{
                headers: {
                    'Content-Type': 'application/json',
                }
            })).json();
            return movies.data.movies;
        },
        movie : async (_,{id})=>{
            const movies = await (await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`,{
                headers: {
                    'Content-Type': 'application/json',
                }
            })).json();
            return movies.data.movie;
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
        fullName : ({firstName,lastName})=>{
            return `${firstName} ${lastName}`;
        }
    },
    Tweet:{
        author:({userId}/* root */)=>{
            
            const tmpUser = users.find(user=>user.id === userId)
            return tmpUser;
        }
    }
}


const server  = new ApolloServer({typeDefs,resolvers});


server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
})