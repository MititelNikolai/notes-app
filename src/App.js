import './App.css'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import { useState, useEffect } from 'react'
//import {data} from './data.js';
import Split from 'react-split'
import { nanoid } from 'nanoid'

function App() {
	const [notes, setNotes] = useState(
		() => JSON.parse(localStorage.getItem('notes')) || []
	)

	const [currentNoteId, setCurrentNoteId] = useState(
		(notes[0] && notes[0].id) || ''
	)

	useEffect(() => {
		localStorage.setItem('notes', JSON.stringify(notes))
	}, [notes])

	function createNewNote() {
		const newNote = {
			id: nanoid(),
			body: "Type your markdown note's title here",
		}
		setNotes(prevNotes => [newNote, ...prevNotes])
		setCurrentNoteId(newNote.id)
	}

	function updateNote(text) {
		setNotes(oldNotes => {
			const newArray = []
			for (let i = 0; i < oldNotes.length; i++) {
				if (oldNotes[i].id === currentNoteId) {
					newArray.unshift({ ...oldNotes[i], body: text })
				} else {
					newArray.push(oldNotes[i])
				}
			}
			return newArray
		})
	}

	function deleteNote(event, noteId) {
		event.stopPropagation()
		setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
	}
	function findCurrentNote() {
		return (
			notes.find(note => {
				return note.id === currentNoteId
			}) || notes[0]
		)
	}
	return (
		<main className='container app__container'>
			{notes.length > 0 ? (
				<Split sizes={[20, 80]} direction='horizontal' className='split'>
					<Sidebar
						notes={notes}
						currentNote={findCurrentNote()}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						deleteNote={deleteNote}
					/>
					{currentNoteId && notes.length > 0 && (
						<Editor currentNote={findCurrentNote()} updateNote={updateNote} />
					)}
				</Split>
			) : (
				<div className='no-notes'>
					<h1>You have no notes</h1>
					<button className='first-note' onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	)
}

export default App
