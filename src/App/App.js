import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import Context from '../Context';
import dummyStore from '../dummy-store';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        const ApiUrl= 'http://localhost:9090'
        fetch(`${ApiUrl}/folders`)
        .then(folderRes => {
            if(folderRes.ok){
                return folderRes.json()
            }
            Promise.reject('Something went wrong')
        })
        .then(folderData => this.setState({folders: folderData}))

        fetch(`${ApiUrl}/notes`)
        .then(noteRes => {
            if(noteRes.ok){
                return noteRes.json()
            }
            Promise.reject('Something went wrong')
        })
        .then(noteData => 
            this.setState({notes: noteData}))
        .catch(err => console.log(err))
    }

    deleteNote = noteId => {
        console.log(this.state)
        const newNotes=this.state.notes.filter(note => note.id !==noteId)
        this.setState({
            notes: newNotes
        })
    }

    renderNavRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component = {NoteListNav}
                        // render={routeProps => (
                        //     <NoteListNav
                        //         folders={folders}
                        //         notes={notes}
                        //         {...routeProps}
                        //     />
                        // )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageNav}
                    render={routeProps => {
                        return <NotePageNav {...routeProps} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component = {NoteListMain}
                                />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageMain}
                    render={routeProps => {
                        // const {noteId} = routeProps.match.params;
                        // const note = findNote(notes, noteId);
                        return <NotePageMain {...routeProps} />;
                    }}
                />
            </>
        );
    }

    render() {
        return (
            <Context.Provider value ={{
                notes: this.state.notes,
                folders: this.state.folders,
                deleting: this.deleteNote
              }}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </Context.Provider>
        );
    }
}

export default App;
