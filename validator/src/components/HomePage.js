import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [templateFile, setTemplateFile] = useState(null);
    const [filledFile, setFilledFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleTemplateFileChange = (event) => {
        setTemplateFile(event.target.files[0]);
    };

    const handleFilledFileChange = (event) => {
        setFilledFile(event.target.files[0]);
    };

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSubmit = async () => {
        if (!templateFile) {
            setError('Please upload the template document.');
        } else if (!filledFile) {
            setError('Please upload the filled document.');
        } else {
            setError('');
        }

        try {
            setIsLoading(true);
            setError('');

            const formData = new FormData();
            formData.append('templateFile', templateFile);
            formData.append('filledFile', filledFile);
            if (prompt) {
                formData.append('prompt', prompt);
            }

            const response = await fetch('http://localhost:3001/api/validate', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process files');
            }

            const data = await response.json();
            setResult(data.validation_results);

        } catch (err) {
            setError(err.message || 'Error processing files');
        } finally {
            setIsLoading(false);
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
            <h1 className="text-center mb-4">Victus - Validator</h1>
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
                placeholder="Enter your additional prompt"
                value={prompt}
                rows={4}
                onChange={handlePromptChange}
                aria-label="Enter your additional prompt"
            />
            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}
            <button className="btn mt-3 btn-primary me-2" onClick={handleSubmit}>Submit</button>
            <button className="btn mt-3 btn-outline-secondary" onClick={handleReset}>Clear prompt</button>
            {isLoading && (
                <div className="d-flex justify-content-center mt-3">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!isLoading && result && (
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
                            <h5 className="modal-title">Clear the prompt field?</h5>
                            <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-footer d-flex justify-content-start">
                            <button type="button" className="btn btn-primary" onClick={confirmReset}>Clear</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
