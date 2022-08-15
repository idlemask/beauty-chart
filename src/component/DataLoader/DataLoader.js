import "./DataLoader.css"
const DataLoader = (props)=> {
    const id = "file-" + props.name
    function drop(ev){
        ev.preventDefault();
        if (ev.dataTransfer.items) {
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                if (ev.dataTransfer.items[i].kind === 'file') {
                    const file = ev.dataTransfer.items[i].getAsFile();
                    console.log(`… file[${i}].name = ${file.name}`);
                    readFile(file)
                }
            }
        } else {
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                console.log(`… file[${i}].name = ${ev.dataTransfer.files[i].name}`);
            }
        }
    }
    const uploadData = ()=>{
        const file = document.getElementById(id)
        file.click()
    }
    function readFile(file){
        var reader = new FileReader();
        reader.onload = function(ev) {
            const data = JSON.parse(ev.target.result.toString())
            props.onDataLoaded(data)
        }
        reader.readAsBinaryString(file)
    }
    function getFileByInput(e){
        e.preventDefault();
        const selectedFile = document.getElementById(id).files[0];
        console.log(selectedFile)
        readFile(selectedFile)
    }
    function DropOverHandler(e){
        e.preventDefault();
    }
  return (
    <div draggable={true} className="Dropper" onDrop={drop} onDragOver={DropOverHandler} onClick={uploadData} style={props.style}>
            拖拽文件到此
        <br/>
        或单击
        <input id={id} type={"file"} onChange={getFileByInput} hidden />
    </div>
  );
}

export default DataLoader;
