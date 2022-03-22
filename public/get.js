async function getTest() {
    let request = new XMLHttpRequest

    request.onload = () =>{
        if(request.status === 200){
            let response = request.responseText
            let jsonAppList = JSON.parse(response)
            console.log((jsonAppList.applist.apps).length)
        }
        else{
            alert("Error:" + request.status)
        }
    }

    request.open("GET", "/getAppList")

    request.send()

    /*let response = await fetch("https://api.steampowered.com/ISteamApps/GetAppList/v2/")

    if (response.ok) {
        let json = await response.json();
        console.log(json)
      } else {
        console.log("HTTP-Error: " + response.status);
      }*/
}   