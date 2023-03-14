import Link from "next/link";
import ArrowLeft from "../components/arrow-left";

export default function ListElement() {

    return (
        <div className="bg-gray-100 w-full grid grid-cols-4">

          <div className=" flex-rows-3">
            <div><p>&nbsp;</p></div>
            <div><p>&nbsp;</p></div>
            <p className="pl-14">Modellname</p>
            <div><p>&nbsp;</p></div>
            <div><p>&nbsp;</p></div>
          </div>

          <div>

          </div>

          <div>
          <div><p>&nbsp;</p></div>
          <div><p>&nbsp;</p></div>
          <div className="grid grid-cols-5">
            <p>M</p>
            <p>M</p>
            <p>M</p>
            <p>M</p>
            <p>M</p>
          </div>
          <div><p>&nbsp;</p></div>
          <div><p>&nbsp;</p></div>
          </div>

          <div className="grid grid-rows-5">
            <div><p>&nbsp;</p></div>
            <p className="pl-5">created at ...</p>
            <p className="pl-5">last edited at ...</p>
            <p className="pl-5">... views</p>
            <div><p>&nbsp;</p></div>
          </div>

        </div>
    )
}
