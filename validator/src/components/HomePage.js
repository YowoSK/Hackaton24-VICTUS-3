import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [templateFile, setTemplateFile] = useState(null);
    const [filledFile, setFilledFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

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
        if (prompt) {
            setShowModal(true);
        }
    };

    const confirmReset = () => {
        setPrompt('');
        setError('');
        setShowModal(false);
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

            {/* Bootstrap Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Reset the prompt?</h5>
                            <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-footer d-flex justify-content-start">
                            <button type="button" className="btn btn-primary" onClick={confirmReset}>Reset</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
