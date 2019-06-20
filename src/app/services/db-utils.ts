//file to put frequently used functions inside

//convertSnaps below is the repetitive action of extracting doc id and data
//templates work similarly to C++
//put template as close to final return statement as possible to ensure strong typing
export function convertSnaps<T>(snaps){
    return <T[]> snaps.map(snap => {
        return {
            id: snap.payload.doc.id,
            ...snap.payload.doc.data()
        }
    });
}