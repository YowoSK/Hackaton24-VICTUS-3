import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [templateFile, setTemplateFile] = useState(null);
    const [filledFile, setFilledFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleTemplateFileChange = (event) => {
        setTemplateFile(event.target.files[0]);
    };

    const handleFilledFileChange = (event) => {
        setFilledFile(event.target.files[0]);
    };

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSubmit = () => {
        if (!templateFile) {
            setError('Please upload the template document.');
        } else if (!filledFile) {
            setError('Please upload the filled document.');
        } else {
            // Simulate document validation and set result
            const simulatedFlaws = `Template Document: ${templateFile.name}\nFilled Document: ${filledFile.name}\nFlaws: Missing title, Incorrect date format, Inconsistent terminology.`;
            setResult(simulatedFlaws);
            setError('');
        }
    };

    const handleReset = () => {
        setPrompt('');
        setError('');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">AI Data Validator</h1>
            <div className="mb-3">
                <label htmlFor="templateFile" className="form-label">Upload Template Document: <b>*</b></label>
                <input
                    type="file"
                    id="templateFile"
                    className="form-control"
                    onChange={handleTemplateFileChange}
                    aria-label="Upload Template Document"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="filledFile" className="form-label">Upload Filled Document: <b>*</b></label>
                <input
                    type="file"
                    id="filledFile"
                    className="form-control"
                    onChange={handleFilledFileChange}
                    aria-label="Upload Filled Document"
                />
            </div>
            <textarea
                className="form-control mb-3"
                placeholder="Enter your prompt"
                value={prompt}
                rows={10}
                onChange={handlePromptChange}
                aria-label="Enter your prompt"
            />
            {error && (
            <div className="alert alert-danger mt-3" role="alert">
                {error}
            </div>
        )}
            <button className="btn mt-3 btn-primary me-2" onClick={handleSubmit}>Submit</button>
            <button className="btn mt-3 btn-outline-primary" onClick={handleReset}>Reset prompt</button>
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
