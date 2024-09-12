import React, { useEffect, useState } from "react";
import { CellPop } from "../src/CellPopComponent";
import { CellPopData } from "../src/cellpop-schema";
import { loadHuBMAPData } from "../src/dataLoading/dataHuBMAP";
import { getDimensions } from "../src/visualization/size";

// const dimensions = {
// 	global: {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]},
// 	heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 400, bottom: 100, left: 0}},
// 	barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
// 	violinTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
// 	barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
// 	violinLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
// 	graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}},
// 	detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}},
// 	textSize: {title: "20px", label: "30px", labelSmall: "20px", tick: "10px"}
// } as CellPopDimensions;

const dimensions = getDimensions(
  1500,
  200,
  400,
  200,
  5,
  5,
  100,
  5,
  1000,
  200,
  400,
  0,
  5,
  5,
  100,
  5,
  1000,
  900,
  50,
  50,
);

const widthRatio = 0.8;
const heightRatio = 0.8;

const widthRight = 45 * 25;
const heightBottom = 20 * 40;

const width = widthRight / widthRatio;
const height = heightBottom / heightRatio;

const widthLeft = width - widthRight;
const heightTop = height - heightBottom;

function Demo() {
  const [data, setData] = useState<CellPopData>();

  // data
  const uuids = [
    "ad693f99fb9006e68a53e97598da1509",
    "173de2e80adf6a73ac8cff5ccce20dfc",
    "b95f34761c252ebbd1e482cd9afae73f",
    "5a5ca03fa623602d9a859224aa40ace4",
    "3c1b10bc912c60c9afc36b7423695236",
    "1dc16eb0270ff73291dd45b6a96aa3c0",
    "b05c21f9c94ce1a22a9694cd0fe0291e",
    "8cdb42ed1194255c74c8462b99bbd7ef",
    "fe0ded5fc0355c95239f9c040dd31e99",
    "367fee3b40cba682063289505b922be1",
    "b99fc30c4195958fbef217fa9ed9ec8f",
    "898138b7f45a67c574e9955fb400e9be",
    "f220c9e7bcaea3a87162cbe61287ea4d",
    "e5f7a14d93659bd0b8dc2819ffa9bc4b",
    "56cbda4789f04d79c0c3dffe21816d48",
    "0b6f63f2bd61a8c091fc7afc0f318ad1",
    "62efbe0a6abd0bcf53ab9ab29e7cd73f",
    "4b62d9d2c248323ce029859f953fdc57",
    "c81b0dc9d16eb825a7d6bce6e1b3678f",
    "5ee240959c96b49d960702755478b9fc",
    "7c9e07c96d144536525b1f889acee14d",
    "dd7ccbc306692fc5ff5e61c22845da21",
    "9a7e6be288b27ddbd3366c4ae41bbcd2",
    "018a905cdbdff684760859f594d3fd77",
    "af5741dad7aecf7960a129c3d2ae642a",
    "6e1db473492095ccc2f1393d7259b9c0",
    "fae9a1f2e7abefca2203765a3c7a5ba1",
    "8d631eee88855ac59155edca2a3bc1ca",
    "1ea6c0ac5ba60fe35bf63af8699b6fbe",
  ];

  // useEffect to make sure the data only loads once
  useEffect(() => {
    loadHuBMAPData(uuids)
      .then((data) => {
        setData(data!);
        // getMainVis(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // const props = {
  // 	data: null,
  // 	theme: "light",
  // }

  console.log(data);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <CellPop
      data={data}
      theme={"light"}
      dimensions={{ width: 1500, height: 1000 }}
    />
  );
}

export default Demo;
