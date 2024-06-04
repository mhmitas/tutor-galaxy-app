import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Linkify from "linkify-react";


const NoteDetailModal = ({ setShowModal, note, handleDelete, handleUpdate }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    return (
        <div onClick={handleOverlayClick} className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-20 z-50 '>
            <div className='shadow-xl p-6 pb-0 bg-base-100 w-full max-w-md rounded-md mx-auto max-h-[80vh] overflow-y-auto relative'>
                <Linkify >
                    <div className="my-link">
                        <h2 className="text-xl mb-4">{note?.title}</h2>
                        <p className='text-justify'>{note?.body}</p>
                    </div>
                </Linkify>
                <div className="sticky bottom-0 mb-0 pb-0">
                    <div className='flex justify-center space-x-4 pb-2 pt-3 bg-base-100'>
                        <button
                            onClick={() => handleUpdate(note?._id)}
                            className="btn btn-sm btn-primary">
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => handleDelete(note?._id)}
                            className="btn hover:btn-error btn-sm" >
                            <FaTrashAlt />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetailModal;