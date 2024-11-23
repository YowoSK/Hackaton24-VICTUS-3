import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSubmit = () => {
        if (file && prompt) {
            // Simulate document validation and set result
            const simulatedFlaws = `Document: ${file.name}\nFlaws: Missing title, Incorrect date format, Inconsistent terminology.`;
            setResult(simulatedFlaws);
        } else {
            alert('Please upload a file and enter a prompt.');
        }
    };

    const handleReset = () => {
        setFile(null);
        setPrompt('');
        setResult('');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">AI Data Validator</h1>
            <div className="mb-3 d-flex">
                <input
                    type="file"
                    className="form-control me-2"
                    onChange={handleFileChange}
                />
            </div>
            <textarea
                className="form-control me-2"
                placeholder="Enter your prompt"
                value={prompt}
                rows={10}
                onChange={handlePromptChange}
            />
            <button className="btn mt-3 btn-primary" onClick={handleSubmit}>Submit</button>
            <button className="btn mt-3 btn-outline-primary" onClick={handleReset}>Reset</button>
            {result && (
                <div className="mt-3">
                    <h2>Results:</h2>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
};

export default HomePage;
