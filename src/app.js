import {graphql, buildSchema} from "graphql";

const schema = buildSchema(`
    type Query {
            hello: String
        }
    `);

const root = { hello:()=>"hello World"};

const result = JSON.parse(JSON.stringify(await graphql({
    schema : schema,
    source : "{ hello }",
    rootValue : root
})));

console.log(result);
