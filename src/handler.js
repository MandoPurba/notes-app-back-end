const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
                title,
                body,
                tags,
                createdAt,
                updatedAt,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'Fail',
        message: 'Gagal menambahkan catatan',
    });
    response.code(501);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'Success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'Fail',
        message: 'Catatan tidak di temukan',
    });
    response.code(404);
    return response;
};

const editNoteByHandler = (request, h) => {
    const { id } = request.params;

    const {title, tags, body} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'Success',
            message: 'Catatan berhasil diperbaharui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'Fail',
        message: 'Gagal memperbaharui catatan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'Success',
            message: 'Catatan berhasil di hapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'Fail',
        message: 'Gagal menghapus catatan',
    });
    response.code(404);
    return response;
};

module.exports = {addNoteHandler, getAllNotesHandler, getNoteByHandler, editNoteByHandler, deleteNoteByIdHandler};
