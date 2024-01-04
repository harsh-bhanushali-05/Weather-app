import axios from "axios";
import Home from "./Home";
function Info(){
    let str=Home();
    const [info, setData] = useState();
    useEffect(function (){axios
      .get(
       str
      )
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    },[]);
      return info;
}

export default Info;