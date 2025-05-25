export const calculateFine = (dueDate) => {
    const returnDate = new Date();
    const diffTime = returnDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
        return 0;
    }
    return diffDays * 10;
}