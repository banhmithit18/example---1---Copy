import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Home.css'
import {useParams } from 'react-router-dom';


function Home() {
  const [folders, setFolders] = useState([]);
  const [folderInput, setFolderInput] = useState('');
  const [flashcardInput, setFlashcardInput] = useState({ question: '', answer: '' });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [printedFlashcards, setPrintedFlashcards] = useState([]);
  const [isEditCollapseOpen, setIsEditCollapseOpen] = useState(false);
  const [isFlip, setIsFlip] = useState(false);
  const [editedFlashcard, setEditedFlashcard] = useState({ question: '', answer: '' });
  const [editedFlashcardIndex, setEditedFlashcardIndex] = useState(null);
  

  useEffect(() => {
    // Get folders from local storage or initialize an empty array
    const storedFolders = JSON.parse(localStorage.getItem('folders')) || [];
    setFolders(storedFolders);
  }, []);

  const {userId} = useParams();
  // Function to add a new folder
  const addFolder = () => {
    const trimmedFolder = folderInput.trim();
    if (trimmedFolder !== '') {
      const newFolder = { name: trimmedFolder, userId: userId, flashcards: [] };
      setFolders([...folders, newFolder]);
      localStorage.setItem('folders', JSON.stringify([...folders, newFolder]));
      setFolderInput('');
    }
  };

  const deleteFolder = () => {
    if (selectedFolder !== null) {
      const updatedFolders = [...folders];
      updatedFolders.splice(selectedFolder, 1);
      setFolders(updatedFolders);
      localStorage.setItem('folders', JSON.stringify(updatedFolders));
      setSelectedFolder(null); // Reset selected folder after deletion
    }
  };

  // Function to add a new flashcard
  const addFlashcard = () => {
    const trimmedQuestion = flashcardInput.question.trim();
    const trimmedAnswer = flashcardInput.answer.trim();
    if (trimmedQuestion !== '' && trimmedAnswer !== '' && selectedFolder !== null) {
      const updatedFolders = [...folders];
      updatedFolders[selectedFolder].flashcards.push({
        question: trimmedQuestion,
        answer: trimmedAnswer,
        flipped: false,
      });
      setFolders(updatedFolders);
      localStorage.setItem('folders', JSON.stringify(updatedFolders));
      setFlashcardInput({ question: '', answer: '' });

      // Update the printed flashcards for display
      setPrintedFlashcards(updatedFolders[selectedFolder].flashcards);
    }
  };

  const openEditModal = (index) => {
    const flashcardToEdit = printedFlashcards[index];
    setEditedFlashcard({ ...flashcardToEdit });
    setEditedFlashcardIndex(index);
    setIsEditCollapseOpen(true);
  };

  const closeEditCollapse = () => {
    setIsEditCollapseOpen(false);
    // Reset the edited flashcard and its index when closing the modal
    setEditedFlashcard({ question: '', answer: '' });
    setEditedFlashcardIndex(null);
  };

  const saveEditedFlashcard = () => {
    if (selectedFolder !== null && editedFlashcardIndex !== null) {
      const updatedFolders = [...folders];
      updatedFolders[selectedFolder].flashcards[editedFlashcardIndex] = editedFlashcard;
      setFolders(updatedFolders);
      localStorage.setItem('folders', JSON.stringify(updatedFolders));

      // Update the printed flashcards for display
      setPrintedFlashcards(updatedFolders[selectedFolder].flashcards);

      // Close the edit modal
      closeEditCollapse();
    }
  };

  const deleteFlashcard = (index) => {
    if (selectedFolder !== null) {
      const updatedFolders = [...folders];
      updatedFolders[selectedFolder].flashcards.splice(index, 1);
      setFolders(updatedFolders);
      localStorage.setItem('folders', JSON.stringify(updatedFolders));
  
      // Update the printed flashcards for display
      setPrintedFlashcards(updatedFolders[selectedFolder].flashcards);
    }
  };

  // Function to print all flashcards in a specific folder
  const printFlashcardsInFolder = () => {
    if (selectedFolder !== null) {
      const flashcards = folders[selectedFolder].flashcards;
      setPrintedFlashcards([...flashcards]);
    }
  };

  // Function to open the modal and start learning flashcards
  const startLearning = () => {
    if (selectedFolder !== null && folders[selectedFolder].flashcards.length > 0) {
      setModalIsOpen(true);
      setCurrentFlashcardIndex(0);
    }
  };
  const renderFolders = () => {
    // Filter folders based on the userId
    const userFolders = folders.filter(folder => folder.userId === userId);
  
    return userFolders.map((folder, index) => (
      <div class='folder-container' key={index}>
        <li id="listFolder">
          <span
            data-bs-toggle="collapse"
            href={`#collapse-${index}`}
            onClick={() => {
              if (selectedFolder === index) {
                // Clicking on the currently selected folder should toggle the collapse
                setSelectedFolder(null);
              } else {
                setSelectedFolder(index);
              }
            }}
            style={{ cursor: 'pointer', fontWeight: selectedFolder === index ? 'bold' : 'normal' }}
          >
            {folder.name}
            <p>{folder.flashcards.length}</p>
          </span>
          <div class={`collapse ${selectedFolder === index ? 'show' : ''}`} id={`collapse-${index}`}>
            <div class="button-container row">
              <button class="col" id="folderButton"  data-bs-toggle="modal" data-bs-target="#myModal" onClick={printFlashcardsInFolder}>
                <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none">
                <path d="M13.9445 14.1875L9.94446 10.1875M13.9445 14.1875L8.946 19.1859C8.28735 19.8446 7.48784 20.3646 6.56993 20.5229C5.64311 20.6828 4.49294 20.736 3.94444 20.1875C3.39595 19.639 3.44915 18.4888 3.609 17.562C3.76731 16.6441 4.28735 15.8446 4.946 15.1859L9.94446 10.1875M13.9445 14.1875C13.9445 14.1875 16.9444 11.1875 14.9444 9.1875C12.9444 7.1875 9.94446 10.1875 9.94446 10.1875M3.5 12C3.5 5.5 5.5 3.5 12 3.5C18.5 3.5 20.5 5.5 20.5 12C20.5 18.5 18.5 20.5 12 20.5" stroke="#FF9292" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <button id="pinkBtn" type="button" className="btn btn-primary col" onClick={startLearning} data-bs-toggle="modalLearn" data-bs-target="#myModalLearn">
                Learn
              </button>
              <button id="pinkBtn" type="button" className="btn btn-primary col" onClick={deleteFolder}>
                Delete
              </button>
            </div>
          </div>
        </li>
      </div>
    ));
  };
  
  
  

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Function to go to the next flashcard
  const nextFlashcard = () => {
    setCurrentFlashcardIndex((prevIndex) => prevIndex + 1);
    renderFlashcards();
  };
  const backFlashcard = () => {
    setCurrentFlashcardIndex((prevIndex) => prevIndex - 1);
    renderFlashcards();
  };

  // Function to flip the current flashcard
  const flipFlashcard = () => {
    const updatedFolders = [...folders];
    updatedFolders[selectedFolder].flashcards[currentFlashcardIndex].flipped = !updatedFolders[selectedFolder].flashcards[currentFlashcardIndex].flipped;
    setFolders(updatedFolders);
  };
  
  // Function to render flashcards within the selected folder
  const renderFlashcards = () => {
    if (selectedFolder !== null) {
      const flashcards = folders[selectedFolder].flashcards;
      if (flashcards.length > 0 && currentFlashcardIndex >= 0 && currentFlashcardIndex < flashcards.length) {
        const currentFlashcard = flashcards[currentFlashcardIndex];
        return (
          <div>
            <h2 className='text-center mx-auto'>Learn Flashcard</h2>
            <div 
              style={{
                borderRadius: "30px",
                width: '500px',
                height: '350px',
                backgroundColor: "#FFE8E8",
                padding: '10px',
                margin: '0 auto',
                cursor: 'pointer',
                transform: currentFlashcard.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.3s',
              }}
              onClick={flipFlashcard}
            >
              <div
                style={{
                  transform: currentFlashcard.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  fontSize: '30px',
                  width: '500px',
                  height: '350px'
                }}
                className='d-flex justify-content-center align-items-center'
              >
                {currentFlashcard.flipped ? currentFlashcard.answer : currentFlashcard.question}
              </div>
            </div>
            <div className='d-flex justify-content-center'>
              <div><button id="pinkBtn" onClick={backFlashcard}>Back</button></div>
              <div><button id="pinkBtn" onClick={nextFlashcard}>Next</button></div>
              <div><button id="pinkBtn" onClick={closeModal}>Close</button></div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <p>No flashcards available for learning in this folder.</p>
            <button id="pinkBtn" onClick={closeModal}>Close</button>
          </div>
        );
      }
    }
  
    return null; // or handle the case where selectedFolder is null
  };

  return (
    <body class="text-center">
      <header class="row">
        <nav class="navbar navbar-default" style={{background:"white"}}>
          <div class="container-fluid">
            <div class="navbar-header" >
              <svg style={{ fontWeight: 'bold' }} width="100px" height="100px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" id="thinking_1_">

              <g id="thinking">

              <linearGradient gradientUnits="userSpaceOnUse" id="SVGID_1_" x1="103.4199" x2="404.6967" y1="344.7432" y2="170.8009">

              <stop offset="0" style={{stopColor:"#FF9292"}}/>

              <stop offset="0.3309" style={{stopColor:"#FF9292"}}/>

              <stop offset="0.546" style={{stopColor:"#FFB4B4"}}/>

              <stop offset="0.8492" style={{stopColor:"#FFDCDC"}}/>

              <stop offset="0.814" style={{stopColor:"#FFDCDC"}}/>

              <stop offset="1" style={{stopColor:"#FFE8E8"}}/>

              </linearGradient>

              <path d="M402.087,210.806c2.694-6.86,4.078-14.104,4.078-21.607c0-32.681-26.594-59.269-59.283-59.269   l-0.561,0.002c-0.901-0.027-1.752-0.62-2.037-1.563c-7.4-24.456-30.428-41.537-55.999-41.537h-1.054   c-13.232,0-24.839,7.084-31.231,17.658c-6.393-10.574-17.999-17.658-31.231-17.658h-1.054c-25.571,0-48.599,17.081-55.999,41.537   c-0.283,0.937-1.093,1.563-2.021,1.563c-0.007,0-0.013,0-0.019,0l-0.559-0.002c-32.689,0-59.284,26.588-59.284,59.269   c0,7.503,1.385,14.748,4.079,21.607c-16.685,10.911-26.879,29.54-26.879,49.655c0,20.373,10.367,39.104,27.34,49.951   c-2.575,6.186-4.082,12.717-4.451,19.488c-0.873,16.021,4.684,31.412,15.646,43.34c10.936,11.898,25.761,18.713,41.745,19.189   c2.081,0.061,4.177,0.016,6.237-0.137c0.902-0.064,1.749,0.387,2.146,1.156c10.086,19.564,30.018,31.719,52.019,31.719h1.054   c13.232,0,24.839-7.084,31.231-17.658c6.393,10.574,17.999,17.658,31.231,17.658h1.054c22.001,0,41.933-12.154,52.018-31.719   c0.397-0.77,1.246-1.223,2.147-1.156c2.061,0.152,4.158,0.197,6.236,0.137c15.984-0.477,30.809-7.291,41.745-19.189   c10.962-11.928,16.519-27.318,15.646-43.34c-0.369-6.77-1.876-13.299-4.452-19.488c16.973-10.848,27.341-29.578,27.341-49.951   C428.966,240.346,418.771,221.717,402.087,210.806z M224.769,415.168h-1.054c-18.24,0-34.767-10.078-43.13-26.301   c-2.238-4.342-6.851-6.916-11.771-6.547c-1.718,0.127-3.468,0.164-5.203,0.113c-13.267-0.396-25.583-6.064-34.68-15.961   c-9.123-9.926-13.748-22.721-13.022-36.029c0.379-6.949,2.175-13.602,5.335-19.766c8.507-16.525,25.319-26.791,43.875-26.791   c8.074,0,16.082,1.99,23.157,5.754l4.697-8.828c-8.516-4.531-18.147-6.926-27.854-6.926c-20.533,0-39.283,10.455-50.121,27.605   c-13.656-9.088-21.963-24.402-21.963-41.031c0-16.314,8.065-31.458,21.34-40.613c10.66,17.553,30.017,28.635,50.744,28.635   c9.962,0,19.81-2.515,28.479-7.272l-4.811-8.767c-7.199,3.951-15.384,6.039-23.668,6.039c-19.057,0-36.064-10.665-44.388-27.832   c-3.249-6.704-4.896-13.922-4.896-21.453c0-27.167,22.109-49.269,49.284-49.269l0.47,0.002c0.038,0,0.075,0,0.113,0   c5.366,0,10.014-3.471,11.586-8.667c6.135-20.274,25.227-34.433,46.428-34.433h1.054c13.304,0,24.342,9.867,26.192,22.666   c-0.13,1.25-0.199,2.519-0.199,3.803v66.049c-5.838-5.632-13.757-9.117-22.48-9.16v-0.004c-12.486,0-22.646-10.159-22.646-22.646   h-10c0,17.946,14.556,32.552,32.48,32.641v0.004c12.487,0,22.646,10.159,22.646,22.646v57.646   c-15.308,2.639-27.002,15.965-27.083,31.996h-0.004c0,12.488-10.158,22.646-22.646,22.646v10c17.945,0,32.552-14.557,32.642-32.48   h0.004c0-10.568,7.279-19.469,17.087-21.953v108.012c0,1.283,0.069,2.553,0.199,3.803   C249.11,405.301,238.072,415.168,224.769,415.168z M397.003,301.492c-10.834-17.148-29.586-27.605-50.121-27.605   c-9.707,0-19.34,2.395-27.855,6.926l4.697,8.828c7.076-3.764,15.084-5.754,23.158-5.754c18.556,0,35.367,10.266,43.871,26.783   c3.164,6.172,4.96,12.824,5.338,19.773c0.727,13.309-3.898,26.104-13.021,36.029c-9.098,9.896-21.413,15.564-34.68,15.961   c-1.734,0.053-3.484,0.014-5.203-0.113c-4.91-0.363-9.533,2.207-11.771,6.547c-8.363,16.223-24.89,26.301-43.13,26.301h-1.054   c-13.304,0-24.342-9.867-26.192-22.666c0.13-1.25,0.198-2.52,0.198-3.803v-56.375c5.789,5.365,13.518,8.664,22.005,8.705v0.004   c12.487,0,22.646,10.16,22.646,22.646h10c0-17.945-14.556-32.553-32.48-32.641v-0.006c-10.902,0-20.029-7.744-22.17-18.021v-68.085   c15.35-2.604,27.086-15.952,27.166-32.012h0.004c0-12.486,10.158-22.646,22.646-22.646v-10c-17.946,0-32.552,14.556-32.642,32.48   h-0.004c0,10.599-7.32,19.517-17.17,21.972v-111.42c0-1.284-0.068-2.553-0.198-3.803c1.851-12.799,12.889-22.666,26.192-22.666   h1.054c21.201,0,40.293,14.159,46.427,34.433c1.573,5.196,6.221,8.667,11.584,8.667c0.037,0,0.076,0,0.113,0l0.473-0.002   c27.175,0,49.283,22.102,49.283,49.269c0,7.531-1.646,14.749-4.896,21.452c-8.323,17.167-25.331,27.832-44.388,27.832   c-8.285,0-16.469-2.088-23.668-6.039l-4.811,8.767c8.669,4.758,18.517,7.272,28.479,7.272c20.728,0,40.084-11.083,50.744-28.635   c13.274,9.155,21.34,24.299,21.34,40.613C418.966,277.09,410.659,292.404,397.003,301.492z" fill="url(#SVGID_1_)"/>

              </g>

              </svg>
              <input
              class="border-0 border-bottom border-2"
              style={{borderColor: "#FFB4B4"}}
              type="text"
              placeholder="Search..."
            />
            </div>
            <ul class="nav navbar-nav" className='row mr-5'>
              <button id="pinkBtn" type="button" className='col btn btn-primary'>Profile</button>
              <button id="pinkBtn" type="button" className='col btn btn-primary'>Flashcard</button>
              <button id="pinkBtn" type="button" className='col btn btn-primary'>Log out</button>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <div id="app">
          <div>
            <input
              class="border-0 border-bottom border-2"
              style={{borderColor: "#FFB4B4"}}
              type="text"
              id="folderInput"
              placeholder="Add a new folder..."
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
            />
            <button onClick={addFolder} id="addIcon">
              <svg  width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                <path opacity="0.5" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" stroke="#FFB4B4" stroke-width="1.5"/>
                <path d="M12 6L12 8M12 8L12 10M12 8H9.99998M12 8L14 8" stroke="#FF9292" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M8 14H16" stroke="#FF9292" stroke-width="1.5" stroke-linecap="round" />
                <path d="M9 18H15" stroke="#FF9292" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <div>
            <h2>Folders</h2>
              <div className="folder-list">
                {renderFolders()}
              </div>
            </div>
          </div>
          {selectedFolder !== null && (
            <div>
            <div class="modal" id="myModal"  >
              <div class="modal-dialog modal-lg mx-auto d-flex align-items-center ">
                <div class="modal-content" >
                  
                  <div class="modal-header" >
                    <h4 class="modal-title">{folders[selectedFolder].name}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                
                  <div class="modal-body " >
                    <div className='row mx-auto d-flex align-items-center'>
                      <input
                        className='col-sm-4'
                        type="text"
                        id="questionInput"
                        placeholder="Enter question..."
                        value={flashcardInput.question}
                        onChange={(e) =>
                          setFlashcardInput({ ...flashcardInput, question: e.target.value })
                        }
                      />
                      <input
                        className='col-sm-5'
                        type="text"
                        id="answerInput"
                        placeholder="Enter answer..."
                        value={flashcardInput.answer}
                        onChange={(e) =>
                          setFlashcardInput({ ...flashcardInput, answer: e.target.value })
                        }
                      />
                      <button className='col-sm-1' onClick={addFlashcard} id="addIcon">
                        <svg  width="35px" height="35px" viewBox="0 0 24 24" fill="none">
                          <path opacity="0.5" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" stroke="#FFB4B4" stroke-width="1.5"/>
                          <path d="M12 6L12 8M12 8L12 10M12 8H9.99998M12 8L14 8" stroke="#FF9292" stroke-width="1.5" stroke-linecap="round"/>
                          <path d="M8 14H16" stroke="#FF9292" stroke-width="1.5" stroke-linecap="round" />
                          <path d="M9 18H15" stroke="#FF9292" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                      </button>
                      <div>
                        <table class="table table-hover">
                          <thead>
                            <tr>
                              <th>Question</th>
                              <th>Answer</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {printedFlashcards.map((flashcard, index) => (
                              <tr key = "index">
                                <td>{flashcard.question}</td>
                                <td>{flashcard.answer}</td>
                                <td>
                                  <div className='row'>
                                    <div className='col'>
                                      <button
                                      data-bs-toggle="collapse" data-bs-target={`#editCollapse${index}`} 
                                      onClick={() => openEditModal(index)}
                                      style={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                      }}
                                      >
                                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                                        <path d="M13.9445 14.1875L9.94446 10.1875M13.9445 14.1875L8.946 19.1859C8.28735 19.8446 7.48784 20.3646 6.56993 20.5229C5.64311 20.6828 4.49294 20.736 3.94444 20.1875C3.39595 19.639 3.44915 18.4888 3.609 17.562C3.76731 16.6441 4.28735 15.8446 4.946 15.1859L9.94446 10.1875M13.9445 14.1875C13.9445 14.1875 16.9444 11.1875 14.9444 9.1875C12.9444 7.1875 9.94446 10.1875 9.94446 10.1875M3.5 12C3.5 5.5 5.5 3.5 12 3.5C18.5 3.5 20.5 5.5 20.5 12C20.5 18.5 18.5 20.5 12 20.5" stroke="#FF9292" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                      </button>
                                      <div className="collapse" id={`editCollapse${index}`}>
                                        <div className="row">
                                          <input id="questionModify" className="col" type="text" placeholder="Edit question..."
                                            value={editedFlashcard.question}
                                            onChange={(e) =>
                                              setEditedFlashcard({
                                                ...editedFlashcard,
                                                question: e.target.value,
                                              })
                                            }
                                          />
                                          <input  id="answerInput"  className="col" type="text" placeholder="Edit answer..."
                                            value={editedFlashcard.answer}
                                            onChange={(e) =>
                                              setEditedFlashcard({
                                                ...editedFlashcard,
                                                answer: e.target.value,
                                              })
                                            }
                                          />
                                          <button id="pinkBtn" data-bs-toggle="collapse" className="col" onClick={() => {saveEditedFlashcard(index);closeEditCollapse(index);}}  data-bs-target={`#editCollapse${index}`}>
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col'>
                                      <button style={{border: 'none',backgroundColor: 'transparent'}} onClick={() => deleteFlashcard(index)}>                                      
                                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V11" stroke="#FF9292" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16 15L18.5 17.5M21 20L18.5 17.5M18.5 17.5L21 15M18.5 17.5L16 20" stroke="#FF9292" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div> 
                  </div>
                  <div class="modal-footer">
                    <button id="pinkBtn" type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Flashcard Modal">
            <div>{renderFlashcards()}</div>
          </Modal>
          <div>  
        </div>
        </div>
      </main>

      <footer>
        <div class="mt-5 p-4 bg-dark text-white text-center">
          <div class="socialIcons">
            <a href='/home'><i class="fa-brands fa-facebook"></i></a>
            <a href='/home'><i class="fa-brands fa-instagram"></i></a>
            <a href='/home'><i class="fa-brands fa-twitter"></i></a>
            <a href='/home'><i class="fa-brands fa-google-plus"></i></a>
            <a href='/home'><i class="fa-brands fa-youtube"></i></a>
          </div>
          <div class="footerNav">
            <ul>
              <li><a href='/home'>Home</a></li>
              <li><a href='/home'>About</a></li>
              <li><a href='/home'>Contact us</a></li>
            </ul>
          </div>
        </div>
        <div class="footerBottom">
            <p>Copyright &copy;2023; Designed by <span class="designer">Amy Nguyen</span></p>
        </div>    
      </footer>
    </body>
  );
}

export default Home;