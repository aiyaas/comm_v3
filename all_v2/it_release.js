// Download data from store to 'csv' format
function __SaveToCSV__() {
    let __myData__ = JSON.parse(localStorage.getItem("__msg__"))
    
    function formatToCsv(__data__) {
        // Convert some 'JSON' to 'CSV' type
        if (typeof __data__ === "object") {
            return Object.entries(__data__)
                .map(([key, value]) => {
                    return typeof value === "object" ? `${key}, ${formatToCsv(value)}` : `${key}, ${value}`;
                })
                .join("\n")          
        }
        
        return null
    }
    
    try {                        
        const a = document.createElement("a")
        a.setAttribute("href", "data:text/csv;charset=utf8," + encodeURIComponent(formatToCsv(__myData__)))
                
        a.setAttribute("download", Date.now() + ".csv")
        document.body.appendChild(a)
        a.click()
        
        // Remove items createElement in the download file
        document.body.removeChild(a)
    } catch (e) {
        __PopUp__("Your browser does not support this feature! Please use a different browser.")
    }
}



// Handle the search feature on the search bar 
const searchInput = document.querySelector("#inlineFormInputGroup")
const items = document.querySelectorAll("#listItems")
const error = document.querySelector("#__eSearch__")

searchInput.addEventListener("input", () => {
    function searchItems(__query__) {
        return items.forEach((i) => {
            let itemsText = i.textContent.toLowerCase()
            
            if (itemsText.includes(__query__.toLowerCase())) {
                i.style.display = "block"
                error.style.display = "none"
            } else {
                i.style.display = "none"
                error.style.display = "block"
                
                error.innerHTML = `Search results <b>${__query__.split(".")[0].substring(0, 23)}</b> ... could not be found!`
            }
        })
    }
    
    return searchItems(searchInput.value.trim())
})
