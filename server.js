import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './src/util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1

  app.get('/filteredimage', async (req, res) => {
    const imageUrl = req.query.image_url
    if (!imageUrl) {
      res.status(422);
      return res.json({
        "message": "image url is missing, pass image url as image_url"
      });
    }
    try {
      await filterImageFromURL(imageUrl)
        .then((outputImage) => {
          console.log(outputImage);
          res.status(200).sendFile(outputImage, {}, (err) => {
            deleteLocalFiles([outputImage])
          })
        })
    }
    catch (err) {
      res.status(500);
      return res.json({
        "message": "error occurred, while fetching the image, please try again"
      });
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
