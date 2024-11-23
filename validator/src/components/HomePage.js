import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = () => {
        if (file && prompt) {
            // Simulate document validation and set result
            const simulatedFlaws = `Document: ${file.name}\nFlaws: Missing title, Incorrect date format, Inconsistent terminology.`;
            setResult(simulatedFlaws);
        } else {
            alert('Please upload a file and enter a prompt.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">AI Data Validator</h1>
            <div className="mb-3 d-flex">
                <input
                    type="file"
                    className="form-control me-2"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Enter your prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
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
