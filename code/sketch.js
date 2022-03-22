//initial setup
let vid;
let poseNet;
let poses = [];
var person1=[];


//variables for download file
var file={};
var count=0;

//localmotor translation export variables
var movement =[];  //locomotor translation
var movementX=[];
var movementY=[];
var vid_loc =[];   //locomotor time record

//motion difficult export variables
var movement_D=[]; //possible difficulty movement record
var movement_DX=[];
var movement_DY=[];
var vid_loc_D =[]; //possible difficulty movement time record

//localmotor rotation export variables
var movement_R=[]; //locomotor rotation
var movement_RX=[];
var movement_RY=[];
var vid_loc_R = [];//locomotor turning

//temporary export variables
var m_v=[];
var temp_array = [];
var downloadFrequency = 120;
var vidRound=0;


//pose identification

let current_pose = "";
let motion_record=["0","0","0"];
let turning_record=["0","0"];
let reaching;
let dXAvg;
let dYAvg;

//draw frame variables
let x = 1;
let y = 1;
let rhx = 1;
let lhx = 1;



//location of joints for path illustration
let ptNose=[];
let ptRWrist=[];
let ptLWrist=[];
let ptRElbow=[];
let ptLElbow=[];
let ptRShoulder=[];
let ptLShoulder=[];
let ptRAnkle=[];
let ptLAnkle=[];
let ptRKnee=[];
let ptLKnee=[];
let ptRHip=[];
let ptLHip=[];

//location of joints for movement identification
let pos = {
  NX:0,rWX:0,lWX:0,rEX:0,lEX:0,rSX:0,lSX:0,
  rAX:0,lAX:0,rKX:0,lKX:0,rHX:0,lHX:0,
  
  NY:0,rWY:0,lWY:0,rEY:0,lEY:0,rSY:0,lSY:0,
  rAY:0,lAY:0,rKY:0,lKY:0,rHY:0,lHY:0
}
let tar = {
  NX:0,rWX:0,lWX:0,rEX:0,lEX:0,rSX:0,lSX:0,
  rAX:0,lAX:0,rKX:0,lKX:0,rHX:0,lHX:0,
  
  NY:0,rWY:0,lWY:0,rEY:0,lEY:0,rSY:0,lSY:0,
  rAY:0,lAY:0,rKY:0,lKY:0,rHY:0,lHY:0
}
let d = {
  NX:0,rWX:0,lWX:0,rEX:0,lEX:0,rSX:0,lSX:0,
  rAX:0,lAX:0,rKX:0,lKX:0,rHX:0,lHX:0,
  
  NY:0,rWY:0,lWY:0,rEY:0,lEY:0,rSY:0,lSY:0,
  rAY:0,lAY:0,rKY:0,lKY:0,rHY:0,lHY:0
}

function setup() {
  createCanvas(960,540);
  vid = createVideo(
    ['BRclip.mp4'],
    vidLoad);
  vid.speed(0.75);
  vid.hide();
  vid.size(960, 540);
  
  poseNet = ml5.poseNet(vid);
  poseNet.on('pose', function(results) {
    poses = results;});

}


// This function is called when the video loads
function vidLoad() {
  vid.play();
  vid.volume(0);
}

function draw() {
  //image(vid, 0, 0, width, height);
  //tint(255,10);
  image(vid,0,0);
  text('time: ' + vid.time() ,
    10,
    50,
    90,
    50
  );
//background(0);
    if (poses.length > 0) {
    let pose = poses[0].pose;
    
    //conver to JSON
    var p = JSON.stringify(pose);
    //var pParse = JSON.parse(p);
    person1.push({"person":p,"time":vid.time()});
    file = JSON.stringify(person1);


  // For one pose only (use a for loop for multiple poses!)
    fill(255, 0, 0);
    noStroke();
  
    let nose = pose['nose'];
    let rWrist = pose['rightWrist'];
    let lWrist = pose['leftWrist'];
    let rElbow = pose['rightElbow'];
    let lElbow = pose['leftElbow'];
    let rShoulder = pose['rightShoulder'];
    let lShoulder = pose['leftShoulder'];
    let rAnkle = pose['rightAnkle'];
    let lAnkle = pose['leftAnkle'];
    let rKnee = pose['rightKnee'];
    let lKnee = pose['leftKnee'];
    let rHip = pose['rightHip'];
    let lHip = pose['leftHip']; 
    
      
    //______________________________________________Append Points
    
    ptNose.push(nose);
    ptRWrist.push(rWrist);
    ptLWrist.push(lWrist);
    ptRElbow.push(rElbow);
    ptLElbow.push(lElbow);
    ptRShoulder.push(rShoulder);
    ptLShoulder.push(lShoulder);
    ptRAnkle.push(rAnkle);
    ptLAnkle.push(lAnkle);
    ptRKnee.push(rKnee);
    ptLKnee.push(lKnee);
    ptRHip.push(rHip);
    ptLHip.push(lHip);
      
  //display skeleton in realtime
      circle(nose.x,nose.y,5);
      circle(rShoulder.x,rShoulder.y,5);
      circle(lShoulder.x,lShoulder.y,5);
      push();
      fill(0,0,255);
      circle(rHip.x,rHip.y,5);
      circle(lHip.x,lHip.y,5);
      pop();
      push();
      fill(0,255,255);
      circle(rWrist.x,rWrist.y,5);
      circle(lWrist.x,lWrist.y,5);
      pop();
    // ___________________________________________reaching   
      
      if (rShoulder.y >= rWrist.y-20 || lShoulder.y >= lWrist.y-20){
        //textSize(50);
        //fill(0,255,255);
        movement_D.push("reaching");
        vid_loc_D.push(vid.time());
        if(rWrist.y>lWrist.y){
        movement_DX.push(lWrist.x);
        movement_DY.push(lWrist.y);
        }
       else{
        movement_DX.push(rWrist.x);
        movement_DY.push(rWrist.y);
       }
        //text("reaching",100,100)
        //print("reaching");
        drawLabel("reaching");
      }
    // ___________________________________________bending
      
      if ((rShoulder.y + lShoulder.y)/2 <= nose.y+15 ){
        //textSize(50);
        movement_D.push("bending");
        movement_DX.push((rShoulder.x+lShoulder.x)/2);
        movement_DY.push((rShoulder.y+lShoulder.y)/2);
        vid_loc_D.push(vid.time());
        //text("bending",100,100);
        print("bending");
        drawLabel("bending");
      }
    // ___________________________________________turning 
      let current_shoulder_dist = dist(rShoulder.x,rShoulder.y,lShoulder.x,lShoulder.y);
      turning_record[0]=turning_record[1];
      turning_record[1]=current_shoulder_dist;
      
      if(turning_record[0]*2 <  turning_record[1] || turning_record[0]>turning_record[1]*2){
        movement_R.push("turning");
        vid_loc_R.push(vid.time());
        movement_RX.push((rShoulder.x+lShoulder.x)/2);
        movement_RY.push((rShoulder.y+lShoulder.y)/2);
        //textSize(50);
        print("turning");
        //text("turning",100,200);
        drawLabel("turning");
        }
      
     else{
       movement_R.push("no turning");
       movement_RX.push((rShoulder.x+lShoulder.x)/2);
       movement_RY.push((rShoulder.y+lShoulder.y)/2);
       vid_loc_R.push(vid.time());
       print("not turning");
      }
    //______________________________________________Draw Head Locaiton
    for (let i =1; i<ptNose.length; i++){
      push();
      stroke(255,0,0);
      strokeWeight(0.5);
      //line(ptNose[i-1].x,ptNose[i-1].y,ptNose[i].x,ptNose[i].y);
      pop();
      }
    
    //______________________________________________Draw Wrist Locaiton
    for (let i =1; i<ptRWrist.length; i++){
      push();
      stroke(0,255,0);
      strokeWeight(0.5);
      //line(ptRWrist[i-1].x,ptRWrist[i-1].y,ptRWrist[i].x,ptRWrist[i].y);
      pop();
      }
      
    for (let i =1; i<ptLWrist.length; i++){
      push();
      stroke(0,255,0);
      strokeWeight(0.5);
     // line(ptLWrist[i-1].x,ptLWrist[i-1].y,ptLWrist[i].x,ptLWrist[i].y);
      pop();
      }
      
   //______________________________________________Draw Elbow Locaiton
   for (let i =1; i<ptRElbow.length; i++){
      push();
      stroke(0,255,255);
      strokeWeight(0.5);
     // line(ptRElbow[i-1].x,ptRElbow[i-1].y,ptRElbow[i].x,ptRElbow[i].y);
      pop();
      }
      
    for (let i =1; i<ptLElbow.length; i++){
      push();
      stroke(0,255,255);
      strokeWeight(0.5);
     // line(ptLElbow[i-1].x,ptLElbow[i-1].y,ptLElbow[i].x,ptLElbow[i].y);
      pop();
      }
    
   //______________________________________________Draw Shoulder Locaiton
    
   for (let i =1; i<ptRShoulder.length; i++){
      push();
      stroke(255,255,0);
      strokeWeight(0.5);
      //line(ptRShoulder[i-1].x,ptRShoulder[i-1].y,ptRShoulder[i].x,ptRShoulder[i].y);
      //line(ptRShoulder[i].x,ptRShoulder[i].y,ptLShoulder[i].x,ptLShoulder[i].y);
      pop();}

     
      
    for (let i =1; i<ptLShoulder.length; i++){
      push();
      stroke(255,255,0);
      strokeWeight(0.5);
      //line(ptLShoulder[i-1].x,ptLShoulder[i-1].y,ptLShoulder[i].x,ptLShoulder[i].y);
      pop();
      }
    
   //______________________________________________Draw Ankle Locaiton
   for (let i =1; i<ptRAnkle.length; i++){
      push();
      stroke(0,255,100);
      strokeWeight(0.5);
      //line(ptRAnkle[i-1].x,ptRAnkle[i-1].y,ptRAnkle[i].x,ptRAnkle[i].y);
      pop();
      }
      
    for (let i =1; i<ptLAnkle.length; i++){
      push();
      stroke(0,255,100);
      strokeWeight(0.5);
      //line(ptLAnkle[i-1].x,ptLAnkle[i-1].y,ptLAnkle[i].x,ptLAnkle[i].y);
      pop();
      }
      
   //______________________________________________Draw Knee Locaiton
   for (let i =1; i<ptRKnee.length; i++){
      push();
      stroke(100,255,0);
      strokeWeight(0.5);
      //line(ptRKnee[i-1].x,ptRKnee[i-1].y,ptRKnee[i].x,ptRKnee[i].y);
      pop();
      }
      
    for (let i =1; i<ptLKnee.length; i++){
      push();
      stroke(100,255,0);
      strokeWeight(0.5);
      //line(ptLKnee[i-1].x,ptLKnee[i-1].y,ptLKnee[i].x,ptLKnee[i].y);
      pop();
      }    
      
   //______________________________________________Draw Hip Locaiton
   for (let i =1; i<ptRHip.length; i++){
      push();
      stroke(255,0,255);
      strokeWeight(0.5);
      //line(ptRHip[i-1].x,ptRHip[i-1].y,ptRHip[i].x,ptRHip[i].y);
      pop();
      }
      
    for (let i =1; i<ptLHip.length; i++){
      push();
      stroke(255,0,255);
      strokeWeight(0.5);
      //line(ptLHip[i-1].x,ptLHip[i-1].y,ptLHip[i].x,ptLHip[i].y);
      pop();
      }   

    pos.NX = nose.x;
    pos.NY = nose.y;
    pos.rWX = rWrist.x;
    pos.rWY = rWrist.y;
    pos.lWX = lWrist.x;
    pos.lWY = lWrist.y;
    pos.rEX = rElbow.x;
    pos.rEY = rElbow.y;
    pos.lEX = lElbow.x;
    pos.lEY = lElbow.y;
    pos.rSX = rShoulder.x;
    pos.rSY = rShoulder.y;
    pos.lSX = lShoulder.x;
    pos.lSY = lShoulder.y;
    pos.rAX = rAnkle.x;
    pos.rAY = rAnkle.y;
    pos.lAX = lAnkle.x;
    pos.lAY = lAnkle.y;
    pos.rKX = rKnee.x;
    pos.rKY = rKnee.y;
    pos.lKX = lKnee.x;
    pos.lKY = lKnee.y;
    pos.rHX = rHip.x;
    pos.rHY = rHip.y;
    pos.lHX = lHip.x;
    pos.lHY = lHip.y;
  
    //_________________________________________________calculate average movement
    d.NX =abs(tar.NX-pos.NX);
    d.NY =abs(tar.NY-pos.NY);
    d.rWX =abs(tar.rWX-pos.rWX);
    d.rWY =abs(tar.rWY-pos.rWY);
    d.lWX =abs(tar.lWX-pos.lWX);
    d.lWY =abs(tar.lWY-pos.lWY);
    d.rEX =abs(tar.rEX-pos.rEX);
    d.rEY =abs(tar.rEY-pos.rEY);
    d.lEX =abs(tar.lEX-pos.lEX);
    d.lEY =abs(tar.lEY-pos.lEY);
    d.rSX =abs(tar.rSX-pos.rSX);
    d.rSY =abs(tar.rSY-pos.rSY);
    d.lSX =abs(tar.lSX-pos.lSX);
    d.lSY =abs(tar.lSY-pos.lSY);
    d.rAX =abs(tar.rAX-pos.rAX);
    d.rAY =abs(tar.rAY-pos.rAY);
    d.lAX =abs(tar.lAX-pos.lAX);
    d.lAY =abs(tar.lAY-pos.lAY);
    d.rKX =abs(tar.rKX-pos.rKX);
    d.rKY =abs(tar.rKY-pos.rKY);
    d.lKX =abs(tar.lKX-pos.lKX);
    d.lKY =abs(tar.lKY-pos.lKY);
    d.rHX =abs(tar.rHX-pos.rHX);
    d.rHY =abs(tar.rHY-pos.rHY);
    d.lHX =abs(tar.lHX-pos.lHX);
    d.lHY =abs(tar.lHY-pos.lHY);
  
    dXAvg = ( d.NX+ d.rWX + d.lWX + d.rSX + d.lSX + d.rKX+ d.lKX)/7;
    dYAvg = ( d.NY+ d.rWY + d.lWY + d.rSY + d.lSY + d.rKY+ d.lKY)/7;
  //console.log("pos ");
  //console.log(pos);
  //console.log("tar ");
  //console.log(tar);
  //console.log(d, dXAvg +","+dYAvg);
 
  //______________________________________________________________assign local motor for individual frames   
  if (dXAvg>10 || dYAvg>10 && dXAvg!=0 && dYAvg!=0 ){
    current_pose = "translating";  
    }
  else if(dXAvg!=0 && dYAvg!=0) {
    current_pose = "fixed";
  }
  
  
  motion_record[0]=motion_record[1];
  motion_record[1]=motion_record[2];
  motion_record[2]=current_pose;
  //______________________________________________________________local motor output
  //starting with walking
  if(motion_record[0]=="translating" && motion_record[1]=="translating" && motion_record[2]=="translating"){
    print("translating "+ vid.time());
    movement.push('translating');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("translating");
    }  
      
  if(motion_record[0]=="translating" && motion_record[1]=="translating" && motion_record[2]=="fixed"){
    print("fixed " + vid.time());
    movement.push('fixed');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("fixed");
    }
      
      
  if(motion_record[0]=="translating" && motion_record[1]=="fixed" && motion_record[2]=="translating"){
    print("translating "+ vid.time());
    movement.push('translating');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("translating");
    }
      
  if(motion_record[0]=="translating" && motion_record[1]=="fixed" && motion_record[2]=="fixed"){
    print("fixed "+ vid.time());
    movement.push('fixed');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("fixed");
    }
      
      
 
  if(motion_record[0]=="fixed" && motion_record[1]=="translating" && motion_record[2]=="translating"){
    print("translating "+ vid.time());
    movement.push('translating');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("translating");
    }  
      
  if(motion_record[0]=="fixed" && motion_record[1]=="translating" && motion_record[2]=="fixed"){
    print("fixed "+ vid.time());
    movement.push('fixed');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("fixed");
    }
      
      
  if(motion_record[0]=="fixed" && motion_record[1]=="fixed" && motion_record[2]=="translating"){
    print("translating "+ vid.time());
    movement.push('translating');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("translating");
    }
      
  if(motion_record[0]=="fixed" && motion_record[1]=="fixed" && motion_record[2]=="fixed"){
    print("fixed "+ vid.time());
    movement.push('fixed');
    vid_loc.push(vid.time());
    movementX.push((rShoulder.x+lShoulder.x)/2);
    movementY.push((rShoulder.y+lShoulder.y)/2);
    drawLabel("fixed");
    }
      
    
  
    tar.NX = pos.NX;
    tar.NY = pos.NY;
    tar.rWX = pos.rWX;
    tar.rWY = pos.rWY;
    tar.lWX = pos.lWX;
    tar.lWY = pos.lWY;
    tar.rEX = pos.rEX;
    tar.rEY = pos.rEY;
    tar.lEX = pos.lEX;
    tar.lEY = pos.lEY;
    tar.rSX = pos.rSX;
    tar.rSY = pos.rSY;
    tar.lSX = pos.lSX;
    tar.lSY = pos.lSY;
    tar.rAX = pos.rAX;
    tar.rAY = pos.rAY;
    tar.lAX = pos.lAX;
    tar.lAY = pos.lAY;
    tar.rKX = pos.rKX;
    tar.rKY = pos.rKY;
    tar.lKX = pos.lKX;
    tar.lKY = pos.lKY;
    tar.rHX = pos.rHX;
    tar.rHY = pos.rHY;
    tar.lHX = pos.lHX;
    tar.lHY = pos.lHY;
  }
  

  //for (let i = downloadFrequency; i < vid.duration(); i=i+downloadFrequency) {
  //  if (vid.time()> vidRound+i){
  //    count =0;
  //    download();
  //    count =1;
  //    vidRound = vid.time();
  //  }
  //}



  if (vid.time()==vid.duration()){
      count = 0;
      download();
      count = 1;
      noLoop();
    }
  }
function download(){
  if(count==1){
    return;
  }
  else{
      count=1;
      temp_array.push("Movement_Localmotor_Translation");
      temp_array.push("Timestamp_LT");
      temp_array.push("ML_T_X");
      temp_array.push("ML_T_Y");
      temp_array.push("Movement_Localmotor_Rotation");
      temp_array.push("Timstemp_LR");
      temp_array.push("ML_R_X");
      temp_array.push("ML_R_Y");
      temp_array.push("Movement_Difficulty");
      temp_array.push("Timstemp_MD");
      temp_array.push("MD_X");
      temp_array.push("MD_Y");
            
      m_v.push(temp_array);
    
      for (let i = 0; i < movement.length; i++) {
        temp_array = [];
        temp_array.push(movement[i]);
        temp_array.push(vid_loc[i]);
        temp_array.push(movementX[i]);
        temp_array.push(movementY[i]);
        if (i< movement_R.length){
        temp_array.push(movement_R[i]);
        temp_array.push(vid_loc_R[i]);
        temp_array.push(movement_RX[i]);
        temp_array.push(movement_RY[i]);
        }
        else{
        temp_array.push("nan");
        temp_array.push("nan");
        temp_array.push("nan");
        temp_array.push("nan");
        }
        if (i< movement_D.length){
        temp_array.push(movement_D[i]);
        temp_array.push(vid_loc_D[i]);
        temp_array.push(movement_DX[i]);
        temp_array.push(movement_DY[i]);
        }
        else{
        temp_array.push("nan");
        temp_array.push("nan");
        temp_array.push("nan");
        temp_array.push("nan");
        }
        m_v.push(temp_array);
      
      }
      let csvContent = "data:text/csv;charset=utf-8," 
      + m_v.map(e => e.join(",")).join("\n");
      //var csv = movement.join();
      //var a= document.write(csv);
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "1_kitchencase.csv");
      link.click(); 
      //csv = vid_loc.join();
      //document.write(csv);
    }

    movement =[];  //locomotor translation
        movementX=[];
        movementY=[];
        vid_loc =[];   //locomotor time record
        movement_D=[]; //possible difficulty movement record
        movement_DX=[];
        movement_DY=[];
        vid_loc_D =[]; //possible difficulty movement time record
        movement_R=[]; //locomotor rotation
        movement_RX=[];
        movement_RY=[];
        vid_loc_R = [];//locomotor turning
        temp_array=[];
        m_v=[];
  }




function intersect_point(point1, point2, point3, point4) {
   const a = ((point4.x - point3.x) * (point1.y - point3.y) - 
             (point4.y - point3.y) * (point1.x - point3.x)) /
            ((point4.y - point3.y) * (point2.x - point1.x) - 
             (point4.x - point3.x) * (point2.y - point1.y));
  
  const x = point1.x + a * (point2.x - point1.x);
  const y = point1.y + a * (point2.y - point1.y);
  
  return [x, y]
}

function drawLabel(moveid) {
  
  
  var labelpre;
  //if (moveid != 'turning') {
    labelpre = moveid;
  //}
  
  // Easing varibale
  let easing = 1;
  
  let targetNoseX = pos.NX - 70;
  let dEaseX = targetNoseX - x;
  x += dEaseX * easing;
  
  let targetNoseY = pos.NY - 60;
  let dEaseY = targetNoseY - y;
  y += dEaseY * easing;
  
  let targetRHandX = pos.rHX;
  let dEasyRHX = targetRHandX - rhx;
  rhx += dEasyRHX * easing;
  
  let targetLHandX = pos.lHX;
  let dEasyLHX = targetLHandX - lhx;
  lhx += dEasyLHX * easing;
  
  let boxwidth = rhx - lhx + 160;
  let boxheight = ((pos.NY + pos.rKY)/2) + 120;
  
  // Draw box
  //push();   
  //noFill();
  //stroke(130, 218, 149);
  //stroke(255, 0, 122);                    // Pink
  //strokeWeight(2);
  //rect(x, y, boxwidth, boxheight);
  //pop();
  
  // Draw Text
  //if (moveid != 'turning') {
    //push();
    //strokeWeight(6);
    //stroke(255, 0, 122);  
    //fill(130, 218, 149);
    //noFill();
    //fill(255, 0, 122);     
    //pop();

    push(); 
      textSize(15);
      textFont('Helvetica');
      fill(255, 0, 122); 
    if (moveid == "translating" || moveid == "fixed" ){
      text(labelpre, x - 2, y + boxheight + 25);
      push(); 
      stroke(255, 0, 122);                    // Pink
      noFill();
      strokeWeight(2);
      rect(x, y, boxwidth, boxheight);
      pop();  
    }
    else if (moveid =="turning"){
      text(labelpre, x + 2*boxwidth/3, y + boxheight + 25);
    } 
    else if (moveid =="bending"||moveid =="reaching"){
      text(labelpre, x + boxwidth/3, y + boxheight + 25);
    } 
    pop();
  //} 
}