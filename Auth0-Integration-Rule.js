// Main function to handle the ID Verification
async function LibraXIdVerification(payload_data, callback){

    // Check if Ocp-Apim-Subscription-Key is present
    if(!configuration.Subscription_Key){
            console.log('Missing required Ocp-Apim-Subscription-Key. Skipping.');
            return callback(new Error("Missing required Ocp-Apim-Subscription-Key. Skipping."));
    }

    // Check if First Name or Last name exists
    if (!payload_data.FirstName ||
        !payload_data.LastName){
            console.log('Missing First name or Last name');
            return callback(new Error("Missing First name or Last name"));
    }
    
    // Check if base64encoding for Image is present
    if (!payload_data.base64encoding){
            console.log('Missing base64encoded string');
            return callback(new Error("Missing base64encoded string"));
    }
    
    // Make Post request to LibraX ID Verification Service 
    const axios = require('axios');
    let apiResponse;
    const baseURL = "https://api.librax.ai";
    
    let config = {
        headers: {
            'Ocp-Apim-Subscription-Key': configuration.Subscription_Key,
            'Content-Type': 'application/json'
        }
    }
    apiResponse = await axios.post(baseURL + "/id/verify",{
        FirstName: payload_data.FirstName,
        LastName: payload_data.LastName,
        IDPhoto: payload_data.base64encoding
    }, config)
    .catch((apiHttpError)=>{
        return callback(new Error("Error while calling ID Verification API"));
    });
    
    // Check if response status is 200
    let responseStatus = typeof apiResponse.status === 'number' ? apiResponse.status : 500;
    if (responseStatus != 200){
        return callback(new Error("Some error occured"));
    }
    
    // check if IDStatus is undefined if not set it to appropirate value
    let verifedStatus = typeof apiResponse.data.result.IDStatus === "boolean" ? apiResponse.data.result.IDStatus : false;
    if (!verifedStatus){
        return callback(new Error("Unauthorized User"));
    }

    return callback(null);
}
