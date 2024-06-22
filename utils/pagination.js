

function paginate(pageNumber, pageLength, totalLength) {
    if (pageNumber <= 0 || pageLength <= 0 || totalLength < 0) {
        throw new Error("Page number and page length must be greater than 0, and total length must be non-negative");
    }

    const totalPages = Math.ceil(totalLength / pageLength);
    const offset = (pageNumber - 1) * pageLength;
    if (pageNumber > totalPages && totalPages != 0 ) {
        throw new Error("Page number exceeds total pages");
    }
    return { totalPages, offset }

}

module.exports = paginate;
