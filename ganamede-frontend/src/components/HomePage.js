import React, {useState, useRef} from 'react';
import {Container, Button, Form} from 'react-bootstrap';
import AWS from 'aws-sdk';

const HomePage = () => {
    //React hooks
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    //Function to handle file change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file));
            console.log('File selected:', file.name);
            console.log('File type:', file.type);
            console.log('File size:', file.size, 'bytes');
        }
    };

    //This function handles submit whenever the user clicks the submit button
    const handleSubmit = (event) => {
        event.preventDefault();
        if(!selectedFile){
            alert('Please select and image first!');
            return;
        }

        
        // S3 upload implementation
        // Configure AWS SDK
        AWS.config.update({
            region: process.env.REACT_APP_AWS_REGION,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID
            })
        });
        
        // Create S3 service object
        const s3 = new AWS.S3();
        
        // Prepare the parameters for S3 upload
        const params = {
            Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${selectedFile.name}`, // Use timestamp to make filename unique
            Body: selectedFile,
            ContentType: selectedFile.type
        };
        
        // Upload file to S3
        s3.upload(params, (err, data) => {
            if (err) {
                console.error("Error uploading to S3:", err);
                alert("Upload failed!");
            } else {
                console.log("Successfully uploaded to S3:", data.Location);
                alert("Upload successful!");
            }
        });
    };

    //The component's UI
    return (
        <Container className="py-5">
            {/*Main title of the page*/}
            <h1 className="text-center mb-4" style={{ color:"#ffffff" }}> 
                <span style={{ fontSize: '1.2em' }}>G</span>ANAMEDE 
            </h1>

            {/*Subtitle with space theme*/}
            <p className="text-center mb-4" style={{color: '#ffffff', opacity: 0.8}}>
                Explore the cosmos through imagery
            </p>

            <Form onSubmit = {handleSubmit} className="d-flex flex-column align-items-center">

                {/*Hidden gile input - we'll stule our own button*/}
                <Form.Control
                    type = "file"
                    id = "image-upload"
                    accept="image/*"//accept only image files
                    onChange = {handleFileChange}
                    style={{display:'none'}}// Hide the default input
                    ref={fileInputRef}// Reference to access the input
                />

                {/*Custom styled button that sends the image file*/}
                <Button
                    variant="primary"
                    onClick={() => fileInputRef.current.click()}
                    className="mb-3"
                >
                    <i className="fas fa-upload me-2"></i> Submit Image
                </Button>

                {/*If a file is selected, show its name*/}
                {selectedFile && (
                    <p className = "text-center" style={{color: '#cbd5e0'}}>
                        Selected file: {selectedFile.name}
                    </p>
                )}

                {/*If a preview URL exists, show the image preview*/}
                {previewUrl && (
                    <div className="mt-3 text-center">
                        <h5 style ={{color: '#7aa2f7'}}>Preview:</h5>
                        <div style = {{
                            padding: '10px',
                            background: 'rgba(10, 17, 40, 0.5)',
                            borderRadius: '8px',
                            border: '1px solid rgba(122, 162, 247, 0.2)'
                        }}>
                            <img
                                src = {previewUrl}
                                alt = "Preview"
                                style = {{
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }}
                            />
                        </div>
                    </div>
                )}

                {/*Submit button - only enabled if a file is selected*/}
                {selectedFile && (
                    <Button
                        variant="success"
                        type="submit"
                        className="mt-3"
                    >
                    Upload Image
                    </Button>
                )}
            </Form>
        </Container>
    )

}

export default HomePage;