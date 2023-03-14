import Link from "next/link";
import ArrowLeft from "../components/arrow-left";

export default function ListElement() {

    return (
        <div className="bg-gray-100 w-9/12 h-32 grid grid-cols-4 ">
        <div className="grid grid-template-rows">
        <p></p>
        <p>Modellname</p>
        <p></p>
        </div>






        <div><p></p></div>
        <div className="grid grid-cols-5">
        <p>M</p>
        <p>M</p>
        <p>M</p>
        <p>M</p>
        <p>M</p>
        </div>


        <div className="grid-cols-5">
        <p>created at ...</p>
        <p>last edited at ...</p>
        <p>... views</p>
        </div>
          </div>
    )
}
