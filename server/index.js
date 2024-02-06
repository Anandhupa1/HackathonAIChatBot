const express = require("express")
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer,{cors:{origin:"*"}})
require("dotenv").config();
app.use(express.json());
const cors = require("cors");
const { connection } = require("./config/connection.mongoose");
const { dataRouter } = require("./routes/data");
//------------------------------------------
const { QdrantVectorStore } = require("langchain/vectorstores/qdrant");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { QdrantClient } = require('@qdrant/js-client-rest');
const { RetrievalQAChain } = require("langchain/chains");
const OpenAI = require("openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { BufferMemory } = require("langchain/memory");
const { ChatModel } = require("./models/chat.model");

//--middlewares----------------------------------
app.use(cors())

app.get("/",async(req,res)=>{
    res.send("home page")
})
app.use("/data",dataRouter)


io.on("connection",(socket)=>{
    //taking queries from user and responding with socket ...
    socket.on("query",async(body)=>{
        
//)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
let query = body.query;
        // if(!body.query || !body.chatId){ socket.emit("error","please provide chatId with query")}
        // else{
     
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            new OpenAIEmbeddings(),
            {
              url: process.env.QDRANT_URL,
              collectionName: process.env.COLLECTION_NAME,
            }
          );
       
          //------experimenting
          
          const model = new ChatOpenAI({
            modelName:"gpt-3.5-turbo",
            streaming:true,
            temperature:0.5,
            modelKwargs:10,
            callbacks: [
              {
                handleLLMNewToken(token) {
                  console.log(token)
                  socket.emit("token",token)
                  
                },
             
              },
            ],
          });
          let qa = RetrievalQAChain.fromLLM(
            model,
            vectorStore.asRetriever(),
          );


          
          let question = `Act as a kind  chatbot created created for a company named webcastle media ,answer users queries 
                         following question positively, use imojicons in answer ,  query:${query} , `
          const response = await qa.call({query: question })
          console.log(response)
          
          
         
          // let pushingQueryToDatabase = await ChatModel.findByIdAndUpdate(
          //   body.chatId, 
          //   { $push: { data: {user:query} } }, 
          //   { new: true, useFindAndModify: false }
          // );
          // let pushingResponseToDatabase = await ChatModel.findByIdAndUpdate(
          //   body.chatId, 
          //   { $push: { data: {bot:response.text} } }, 
          //   { new: true, useFindAndModify: false }
          // );

          //combining above 2 operations 
        

        








        // }
    })

})




httpServer.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("connected to remote db")
    } catch (error) {
        console.log("error in connection", error)
    }
    console.log(`app started @ http://localhost:${process.env.PORT}`)
})

