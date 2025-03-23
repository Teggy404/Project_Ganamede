import React, {useState, useRef, useEffect} from 'react';
import {Container, Button, Form} from 'react-bootstrap';

const HomePage = () => {
    // State to store the selected image file
    // useState is react Hook that lets you add state to a functional component
    // Initially, no image is selected, so we set it to null
    const [selectedFile, setSelectedFile] = useState(null);

    //state to store the preview URL of the selected image
    //This will be used to display a preview of the image
    const [previewUrl, setPreviewUrl] = useState(null);
    
    //create a ref for the file input
    const fileInputRef = useRef(null);

    //create stars in the background
    useEffect(() => {
        const createStars = () => {
            const app = document.querySelector('.App');
            const starCount = 100;

            //clear new stars
            const existingStars = document.querySelectorAll('.star');
            existingStars.forEach(star => star.remove());

            for (let i = 0; i < starCount; i++){
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.width = `${Math.random() * 3}px`;
                star.style.height = star.style.width;
                star.style.animationDelay = `${Math.random() * 3}s`;
                app.appendChild(star);
            }
        };

        createStars();

        //Clean up stars when component unmounts
        return () => {
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => star.remove());
        };
    }, []);

    //This funciton is called when the user selects an image file
    const handleFileChange = (event) => {
        //Get the selected file from the input element
        const file = event.target.files[0];

        if(file){
            //store the file in the state
            setSelectedFile(file)

            //create a URL for the file to use a preview
            //URL.createobjectURL create a temporary URL that points to the file 
            setPreviewUrl(URL.createObjectURL(file));

            //log information about the file to the console
            console.log('File selected:', file.name);
            console.log('File type:', file.type);
            console.log('File size:', file.size, 'bytes');
        }
    };

    //This function handles submit whenever the user clicks the submit button
    const handleSubmit = (event) => {
        //prevent the default form submission behaviour
        //This stops the page from refreshing
        event.preventDefault();

        //if no file is selected, show an alert
        if(!selectedFile){
            alert('Please select and image first!');
            return;
        }

        //Here you would typically send the file to your backend
        //for now, we'll just Log a message
        console.log('Image Submitted:', selectedFile.name);
        
        //In a real application you might use FormData to send the file to your server
        // const formData = new FormData();
        // formData.append('image', selectedFile);
        // fetch('http://yout-backend-url/api/upload', {
        //      method: 'POST',
        //      body: formData,
        //  })
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