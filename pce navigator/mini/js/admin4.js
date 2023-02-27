$(document).ready(function(){
  var c = 1;
  var fixArch = "A";
  var varArch = 1;
  var consideredId = 0;
  var consideredArchId = 0;
  var background, vis, drag;
  var px, py, dx, dy;
  var dijkstra;
  var startpath, endpath;

  vis = d3.select('svg');

  background = vis.append('rect').attr('class', 'background').attr('width', vis.attr('width')).attr('height', vis.attr('height'));

  /* Initialize db */
  var graph = {
      node: [],
      arch: []
  };

  graph.node = TAFFY();
  graph.arch = TAFFY();

  /* Creation of all links in db and in SVG for example map */
  vis.append("line").attr('id', 'A1').attr('class', 'allLine').attr('x1', 138).attr('y1', 81).attr('x2', 138).attr('y2', 111).attr('stroke', 'black');
  graph.arch.insert({id: 'A1', start: 'OZ1', end: 'T1', len: 30, note: ''});
  vis.append("line").attr('id', 'A2').attr('class', 'allLine').attr('x1', 138).attr('y1', 111).attr('x2', 218).attr('y2', 111).attr('stroke', 'black');
  graph.arch.insert({id: 'A2', start: 'T1', end: 'S1', len: 80, note: ''});
  vis.append("line").attr('id', 'A3').attr('class', 'allLine').attr('x1', 138).attr('y1', 111).attr('x2', 138).attr('y2', 168).attr('stroke', 'black');
  graph.arch.insert({id: 'A3', start: 'T1', end: 'X1', len: 57, note: ''});
  vis.append("line").attr('id', 'A4').attr('class', 'allLine').attr('x1', 138).attr('y1', 168).attr('x2', 97).attr('y2', 168).attr('stroke', 'black');
  graph.arch.insert({id: 'A4', start: 'X1', end: 'A10a', len: 41, note: ''});
  vis.append("line").attr('id', 'A5').attr('class', 'allLine').attr('x1', 138).attr('y1', 168).attr('x2', 184).attr('y2', 168).attr('stroke', 'black');
  graph.arch.insert({id: 'A5', start: 'X1', end: 'A28', len: 46, note: ''});
  vis.append("line").attr('id', 'A6').attr('class', 'allLine').attr('x1', 138).attr('y1', 168).attr('x2', 138).attr('y2', 185).attr('stroke', 'black');
  graph.arch.insert({id: 'A6', start: 'X1', end: 'X2', len: 17, note: ''});
  vis.append("line").attr('id', 'A7').attr('class', 'allLine').attr('x1', 138).attr('y1', 185).attr('x2', 184).attr('y2', 185).attr('stroke', 'black');
  graph.arch.insert({id: 'A7', start: 'X2', end: 'A27', len: 46, note: ''});
  vis.append("line").attr('id', 'A8').attr('class', 'allLine').attr('x1', 138).attr('y1', 185).attr('x2', 97).attr('y2', 185).attr('stroke', 'black');
  graph.arch.insert({id: 'A8', start: 'X2', end: 'A11', len: 41, note: ''});
  vis.append("line").attr('id', 'A9').attr('class', 'allLine').attr('x1', 138).attr('y1', 185).attr('x2', 138).attr('y2', 219).attr('stroke', 'black');
  graph.arch.insert({id: 'A9', start: 'X2', end: 'X3', len: 34, note: ''});
  vis.append("line").attr('id', 'A10').attr('class', 'allLine').attr('x1', 138).attr('y1', 219).attr('x2', 184).attr('y2', 219).attr('stroke', 'black');
  graph.arch.insert({id: 'A10', start: 'X2', end: 'A2526', len: 46, note: ''});
  vis.append("line").attr('id', 'A11').attr('class', 'allLine').attr('x1', 138).attr('y1', 219).attr('x2', 97).attr('y2', 219).attr('stroke', 'black');
  graph.arch.insert({id: 'A11', start: 'X2', end: 'A12', len: 41, note: ''});
  vis.append("line").attr('id', 'A12').attr('class', 'allLine').attr('x1', 138).attr('y1', 219).attr('x2', 138).attr('y2', 238).attr('stroke', 'black');
  graph.arch.insert({id: 'A12', start: 'X3', end: 'X4', len: 19, note: ''});
  vis.append("line").attr('id', 'A13').attr('class', 'allLine').attr('x1', 138).attr('y1', 238).attr('x2', 218).attr('y2', 238).attr('stroke', 'black');
  graph.arch.insert({id: 'A13', start: 'X4', end: 'S2', len: 80, note: ''});
  vis.append("line").attr('id', 'A14').attr('class', 'allLine').attr('x1', 138).attr('y1', 238).attr('x2', 97).attr('y2', 238).attr('stroke', 'black');
  graph.arch.insert({id: 'A14', start: 'X4', end: 'A13', len: 41, note: ''});
  vis.append("line").attr('id', 'A15').attr('class', 'allLine').attr('x1', 138).attr('y1', 238).attr('x2', 138).attr('y2', 272).attr('stroke', 'black');
  graph.arch.insert({id: 'A15', start: 'X4', end: 'X5', len: 34, note: ''});
  vis.append("line").attr('id', 'A16').attr('class', 'allLine').attr('x1', 138).attr('y1', 272).attr('x2', 97).attr('y2', 272).attr('stroke', 'black');
  graph.arch.insert({id: 'A16', start: 'X5', end: 'A14', len: 41, note: ''});
  vis.append("line").attr('id', 'A17').attr('class', 'allLine').attr('x1', 138).attr('y1', 272).attr('x2', 184).attr('y2', 272).attr('stroke', 'black');
  graph.arch.insert({id: 'A17', start: 'X5', end: 'A24', len: 46, note: ''});
  vis.append("line").attr('id', 'A18').attr('class', 'allLine').attr('x1', 138).attr('y1', 272).attr('x2', 138).attr('y2', 289).attr('stroke', 'black');
  graph.arch.insert({id: 'A18', start: 'X5', end: 'X6', len: 17, note: ''});
  vis.append("line").attr('id', 'A19').attr('class', 'allLine').attr('x1', 138).attr('y1', 289).attr('x2', 97).attr('y2', 289).attr('stroke', 'black');
  graph.arch.insert({id: 'A19', start: 'X6', end: 'A15', len: 41, note: ''});
  vis.append("line").attr('id', 'A20').attr('class', 'allLine').attr('x1', 138).attr('y1', 289).attr('x2', 183).attr('y2', 289).attr('stroke', 'black');
  graph.arch.insert({id: 'A20', start: 'X6', end: 'A23C', len: 45, note: ''});
  vis.append("line").attr('id', 'A21').attr('class', 'allLine').attr('x1', 138).attr('y1', 289).attr('x2', 138).attr('y2', 325).attr('stroke', 'black');
  graph.arch.insert({id: 'A21', start: 'X6', end: 'T2', len: 36, note: ''});
  vis.append("line").attr('id', 'A22').attr('class', 'allLine').attr('x1', 138).attr('y1', 325).attr('x2', 97).attr('y2', 325).attr('stroke', 'black');
  graph.arch.insert({id: 'A22', start: 'T2', end: 'A16', len: 41, note: ''});
  vis.append("line").attr('id', 'A23').attr('class', 'allLine').attr('x1', 97).attr('y1', 289).attr('x2', 97).attr('y2', 325).attr('stroke', 'black');
  graph.arch.insert({id: 'A23', start: 'A15', end: 'A16', len: 36, note: ''});
  vis.append("line").attr('id', 'A24').attr('class', 'allLine').attr('x1', 138).attr('y1', 325).attr('x2', 138).attr('y2', 341).attr('stroke', 'black');
  graph.arch.insert({id: 'A24', start: 'T2', end: 'T3', len: 16, note: ''});
  vis.append("line").attr('id', 'A25').attr('class', 'allLine').attr('x1', 138).attr('y1', 341).attr('x2',97).attr('y2', 341).attr('stroke', 'black');
  graph.arch.insert({id: 'A25', start: 'T3', end: 'A17', len: 41, note: ''});
  vis.append("line").attr('id', 'A26').attr('class', 'allLine').attr('x1', 138).attr('y1', 341).attr('x2',138).attr('y2', 368).attr('stroke', 'black');
  graph.arch.insert({id: 'A26', start: 'T3', end: 'X7', len: 27, note: ''});
  vis.append("line").attr('id', 'A27').attr('class', 'allLine').attr('x1', 138).attr('y1', 368).attr('x2',97).attr('y2', 368).attr('stroke', 'black');
  graph.arch.insert({id: 'A27', start: 'X7', end: 'A18', len: 41, note: ''});
  vis.append("line").attr('id', 'A28').attr('class', 'allLine').attr('x1', 138).attr('y1', 368).attr('x2',183).attr('y2', 368).attr('stroke', 'black');
  graph.arch.insert({id: 'A28', start: 'X7', end: 'A23', len: 45, note: ''});
  vis.append("line").attr('id', 'A29').attr('class', 'allLine').attr('x1', 138).attr('y1', 368).attr('x2',138).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A29', start: 'X7', end: 'X8', len: 16, note: ''});
  vis.append("line").attr('id', 'A30').attr('class', 'allLine').attr('x1', 138).attr('y1', 384).attr('x2',183).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A30', start: 'X8', end: 'T4', len: 45, note: ''});
  vis.append("line").attr('id', 'A31').attr('class', 'allLine').attr('x1', 138).attr('y1', 384).attr('x2',97).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A31', start: 'X8', end: 'A19', len: 41, note: ''});
  vis.append("line").attr('id', 'A32').attr('class', 'allLine').attr('x1', 138).attr('y1', 384).attr('x2',138).attr('y2', 424).attr('stroke', 'black');
  graph.arch.insert({id: 'A32', start: 'X8', end: 'A20', len: 40, note: ''});
  vis.append("line").attr('id', 'A33').attr('class', 'allLine').attr('x1', 183).attr('y1', 384).attr('x2',183).attr('y2', 424).attr('stroke', 'black');
  graph.arch.insert({id: 'A33', start: 'T4', end: 'A21', len: 40, note: ''});
  vis.append("line").attr('id', 'A34').attr('class', 'allLine').attr('x1', 183).attr('y1', 384).attr('x2',197).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A34', start: 'T4', end: 'X9', len: 14, note: ''});
  vis.append("line").attr('id', 'A35').attr('class', 'allLine').attr('x1', 197).attr('y1', 384).attr('x2',197).attr('y2', 424).attr('stroke', 'black');
  graph.arch.insert({id: 'A35', start: 'X9', end: 'A22', len: 40, note: ''});
  vis.append("line").attr('id', 'A36').attr('class', 'allLine').attr('x1', 197).attr('y1', 384).attr('x2',197).attr('y2', 342).attr('stroke', 'black');
  graph.arch.insert({id: 'A36', start: 'X9', end: 'BATH', len: 42, note: ''});
  vis.append("line").attr('id', 'A37').attr('class', 'allLine').attr('x1', 197).attr('y1', 384).attr('x2',254).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A37', start: 'X9', end: 'X10', len: 57, note: ''});
  vis.append("line").attr('id', 'A38').attr('class', 'allLine').attr('x1', 254).attr('y1', 384).attr('x2',254).attr('y2', 424).attr('stroke', 'black');
  graph.arch.insert({id: 'A38', start: 'X10', end: 'ING4', len: 40, note: ''});
  vis.append("line").attr('id', 'A39').attr('class', 'allLine').attr('x1', 254).attr('y1', 384).attr('x2',254).attr('y2', 348).attr('stroke', 'black');
  graph.arch.insert({id: 'A39', start: 'X10', end: 'ELEV', len: 36, note: ''});
  vis.append("line").attr('id', 'A40').attr('class', 'allLine').attr('x1', 254).attr('y1', 384).attr('x2',292).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A40', start: 'X10', end: 'X11', len: 38, note: ''});
  vis.append("line").attr('id', 'A41').attr('class', 'allLine').attr('x1', 292).attr('y1', 384).attr('x2',292).attr('y2', 348).attr('stroke', 'black');
  graph.arch.insert({id: 'A41', start: 'X11', end: 'A32A', len: 36, note: ''});
  vis.append("line").attr('id', 'A42').attr('class', 'allLine').attr('x1', 292).attr('y1', 384).attr('x2',292).attr('y2', 423).attr('stroke', 'black');
  graph.arch.insert({id: 'A42', start: 'X11', end: 'A33A', len: 39, note: ''});
  vis.append("line").attr('id', 'A43').attr('class', 'allLine').attr('x1', 292).attr('y1', 384).attr('x2',303).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A43', start: 'X11', end: 'T5', len: 11, note: ''});
  vis.append("line").attr('id', 'A44').attr('class', 'allLine').attr('x1', 303).attr('y1', 384).attr('x2',303).attr('y2', 348).attr('stroke', 'black');
  graph.arch.insert({id: 'A44', start: 'T5', end: 'A32', len: 36, note: ''});
  vis.append("line").attr('id', 'A45').attr('class', 'allLine').attr('x1', 303).attr('y1', 384).attr('x2',354).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A45', start: 'T5', end: 'X12', len: 51, note: ''});
  vis.append("line").attr('id', 'A46').attr('class', 'allLine').attr('x1', 354).attr('y1', 384).attr('x2',354).attr('y2', 348).attr('stroke', 'black');
  graph.arch.insert({id: 'A46', start: 'X12', end: 'COF', len: 36, note: ''});
  vis.append("line").attr('id', 'A47').attr('class', 'allLine').attr('x1', 354).attr('y1', 384).attr('x2',354).attr('y2', 447).attr('stroke', 'black');
  graph.arch.insert({id: 'A47', start: 'X12', end: 'OZ2', len: 36, note: ''});
  vis.append("line").attr('id', 'A48').attr('class', 'allLine').attr('x1', 354).attr('y1', 384).attr('x2',413).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A48', start: 'X12', end: 'OZ3', len: 59, note: ''});
  vis.append("line").attr('id', 'A49').attr('class', 'allLine').attr('x1', 218).attr('y1', 111).attr('x2', 228).attr('y2', 73).attr('stroke', 'black');
  graph.arch.insert({id: 'A49', start: 'S1', end: 'OS1A', len: 44, note: ''});
  vis.append("line").attr('id', 'A50').attr('class', 'allLine').attr('x1', 228).attr('y1', 73).attr('x2', 220).attr('y2', 175).attr('stroke', 'black');
  graph.arch.insert({id: 'A50', start: 'OS1A', end: 'OSM1', len: 107, note: ''});
  vis.append("line").attr('id', 'A51').attr('class', 'allLine').attr('x1', 228).attr('y1', 280).attr('x2', 220).attr('y2', 175).attr('stroke', 'black');
  graph.arch.insert({id: 'A51', start: 'OS2A', end: 'OSM1', len: 110, note: ''});
  vis.append("line").attr('id', 'A52').attr('class', 'allLine').attr('x1', 218).attr('y1', 238).attr('x2', 228).attr('y2', 280).attr('stroke', 'black');
  graph.arch.insert({id: 'A52', start: 'S2', end: 'OS2A', len: 48, note: ''});
  vis.append("line").attr('id', 'A53').attr('class', 'allLine').attr('x1', 290).attr('y1', 310).attr('x2', 220).attr('y2', 175).attr('stroke', 'black');
  graph.arch.insert({id: 'A53', start: 'OSM2', end: 'OSM1', len: 152, note: ''});
  vis.append("line").attr('id', 'A54').attr('class', 'allLine').attr('x1', 228).attr('y1', 280).attr('x2', 290).attr('y2', 310).attr('stroke', 'black');
  graph.arch.insert({id: 'A54', start: 'OS2A', end: 'OSM2', len: 74, note: ''});
  vis.append("line").attr('id', 'A55').attr('class', 'allLine').attr('x1', 452).attr('y1', 296).attr('x2', 290).attr('y2', 310).attr('stroke', 'black');
  graph.arch.insert({id: 'A55', start: 'OS3A', end: 'OSM2', len: 168, note: ''});
  vis.append("line").attr('id', 'A56').attr('class', 'allLine').attr('x1', 452).attr('y1', 296).attr('x2', 413).attr('y2', 306).attr('stroke', 'black');
  graph.arch.insert({id: 'A56', start: 'OS3A', end: 'S3', len: 45, note: ''});
  vis.append("line").attr('id', 'A57').attr('class', 'allLine').attr('x1', 413).attr('y1', 306).attr('x2', 413).attr('y2', 384).attr('stroke', 'black');
  graph.arch.insert({id: 'A57', start: 'S3', end: 'OZ3', len: 78, note: ''});

  

  /* Creation of all node in db and in SVG for example map */
  vis.append('circle').attr('id', '1').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 81);
  graph.node.insert({id: '1', label: 'OZ1', x: 138, y: 81, note: ''});
  vis.append('circle').attr('id', '2').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 111);
  graph.node.insert({id: '2', label: 'T1', x: 138, y: 111, note: ''});
  vis.append('circle').attr('id', '3').attr('class', 'point').attr('r', 5).attr('cx', 218).attr('cy', 111);
  graph.node.insert({id: '3', label: 'S1', x: 218, y: 111, note: ''});
  vis.append('circle').attr('id', '4').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 168);
  graph.node.insert({id: '4', label: 'X1', x: 138, y: 168, note: ''});
  vis.append('circle').attr('id', '5').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 168);
  graph.node.insert({id: '5', label: 'A10a', x: 97, y: 168, note: ''});
  vis.append('circle').attr('id', '6').attr('class', 'point').attr('r', 5).attr('cx', 184).attr('cy', 168);
  graph.node.insert({id: '6', label: 'A28', x: 184, y: 168, note: ''});
  vis.append('circle').attr('id', '7').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 185);
  graph.node.insert({id: '7', label: 'X2', x: 138, y: 185, note: ''});
  vis.append('circle').attr('id', '8').attr('class', 'point').attr('r', 5).attr('cx', 184).attr('cy', 185);
  graph.node.insert({id: '8', label: 'A27', x: 184, y: 185, note: ''});
  vis.append('circle').attr('id', '9').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 185);
  graph.node.insert({id: '9', label: 'A11', x: 97, y: 185, note: ''});
  vis.append('circle').attr('id', '10').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 219);
  graph.node.insert({id: '10', label: 'X3', x: 138, y: 219, note: ''});
  vis.append('circle').attr('id', '11').attr('class', 'point').attr('r', 5).attr('cx', 184).attr('cy', 219);
  graph.node.insert({id: '11', label: 'A2526', x: 184, y: 219, note: ''});
  vis.append('circle').attr('id', '12').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 219);
  graph.node.insert({id: '12', label: 'A12', x: 97, y: 219, note: ''});
  vis.append('circle').attr('id', '13').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 238);
  graph.node.insert({id: '13', label: 'X4', x: 138, y: 238, note: ''});
  vis.append('circle').attr('id', '14').attr('class', 'point').attr('r', 5).attr('cx', 218).attr('cy', 238);
  graph.node.insert({id: '14', label: 'S2', x: 218, y: 238, note: ''});
  vis.append('circle').attr('id', '15').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 238);
  graph.node.insert({id: '15', label: 'A13', x: 97, y: 238, note: ''});
  vis.append('circle').attr('id', '16').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 272);
  graph.node.insert({id: '16', label: 'X5', x: 138, y: 272, note: ''});
  vis.append('circle').attr('id', '17').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 272);
  graph.node.insert({id: '17', label: 'A14', x: 97, y: 272, note: ''});
  vis.append('circle').attr('id', '18').attr('class', 'point').attr('r', 5).attr('cx', 184).attr('cy', 272);
  graph.node.insert({id: '18', label: 'A24', x: 184, y: 219, note: ''});
  vis.append('circle').attr('id', '19').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 289);
  graph.node.insert({id: '19', label: 'X6', x: 138, y: 289, note: ''});
  vis.append('circle').attr('id', '19').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 289);
  graph.node.insert({id: '20', label: 'A23C', x: 183, y: 289, note: ''});
  vis.append('circle').attr('id', '20').attr('class', 'point').attr('r', 5).attr('cx', 183).attr('cy', 289);
  graph.node.insert({id: '21', label: 'A15', x: 97, y: 289, note: ''});
  vis.append('circle').attr('id', '21').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 289);
  graph.node.insert({id: '22', label: 'T2', x: 138, y: 325, note: ''});
  vis.append('circle').attr('id', '22').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 325);
  graph.node.insert({id: '23', label: 'T3', x: 138, y: 341, note: ''});
  vis.append('circle').attr('id', '23').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 341);
  graph.node.insert({id: '24', label: 'A16', x: 97, y: 325, note: ''});
  vis.append('circle').attr('id', '24').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 325);   
  graph.node.insert({id: '25', label: 'A17', x: 97, y: 341, note: ''});
  vis.append('circle').attr('id', '25').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 341);
  graph.node.insert({id: '26', label: 'X7', x: 138, y: 368, note: ''});
  vis.append('circle').attr('id', '26').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 368);
  graph.node.insert({id: '27', label: 'X8', x: 138, y: 384, note: ''});
  vis.append('circle').attr('id', '27').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 384);     
  graph.node.insert({id: '28', label: 'T4', x: 183, y: 384, note: ''});
  vis.append('circle').attr('id', '28').attr('class', 'point').attr('r', 5).attr('cx', 183).attr('cy', 384);
  graph.node.insert({id: '29', label: 'A18', x: 97, y: 368, note: ''});
  vis.append('circle').attr('id', '29').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 368);
  graph.node.insert({id: '30', label: 'A23', x: 184, y: 368, note: ''});
  vis.append('circle').attr('id', '30').attr('class', 'point').attr('r', 5).attr('cx', 183).attr('cy', 368);
  graph.node.insert({id: '31', label: 'A19', x: 97, y: 384, note: ''});
  vis.append('circle').attr('id', '31').attr('class', 'point').attr('r', 5).attr('cx', 97).attr('cy', 384);
  graph.node.insert({id: '32', label: 'A20', x: 138, y: 424, note: ''});
  vis.append('circle').attr('id', '32').attr('class', 'point').attr('r', 5).attr('cx', 138).attr('cy', 424);
  graph.node.insert({id: '33', label: 'A21', x: 183, y: 424, note: ''});
  vis.append('circle').attr('id', '33').attr('class', 'point').attr('r', 5).attr('cx', 183).attr('cy', 424);
  graph.node.insert({id: '34', label: 'X9', x: 197, y: 384, note: ''});
  vis.append('circle').attr('id', '34').attr('class', 'point').attr('r', 5).attr('cx', 197).attr('cy', 384);
  graph.node.insert({id: '35', label: 'A22', x: 197, y: 424, note: ''});
  vis.append('circle').attr('id', '35').attr('class', 'point').attr('r', 5).attr('cx', 197).attr('cy', 424);
  graph.node.insert({id: '36', label: 'BATH', x: 197, y: 342, note: ''});
  vis.append('circle').attr('id', '36').attr('class', 'point').attr('r', 5).attr('cx', 197).attr('cy', 342);
  graph.node.insert({id: '37', label: 'X10', x: 254, y: 384, note: ''});
  vis.append('circle').attr('id', '37').attr('class', 'point').attr('r', 5).attr('cx', 254).attr('cy', 384);
  graph.node.insert({id: '38', label: 'ING4', x: 254, y: 424, note: ''});
  vis.append('circle').attr('id', '38').attr('class', 'point').attr('r', 5).attr('cx', 254).attr('cy', 424);
  graph.node.insert({id: '39', label: 'ELEV', x: 254, y: 348, note: ''});
  vis.append('circle').attr('id', '39').attr('class', 'point').attr('r', 5).attr('cx', 254).attr('cy', 348);
  graph.node.insert({id: '40', label: 'X11', x: 292, y: 384, note: ''});
  vis.append('circle').attr('id', '40').attr('class', 'point').attr('r', 5).attr('cx', 292).attr('cy', 384);
  graph.node.insert({id: '41', label: 'A32A', x: 292, y: 348, note: ''});
  vis.append('circle').attr('id', '41').attr('class', 'point').attr('r', 5).attr('cx', 292).attr('cy', 349);
  graph.node.insert({id: '42', label: 'A33A', x: 292, y: 423, note: ''});
  vis.append('circle').attr('id', '42').attr('class', 'point').attr('r', 5).attr('cx', 292).attr('cy', 423);
  graph.node.insert({id: '43', label: 'T5', x: 303, y: 384, note: ''});
  vis.append('circle').attr('id', '43').attr('class', 'point').attr('r', 5).attr('cx', 303).attr('cy', 384);
  graph.node.insert({id: '44', label: 'A32', x: 303, y: 348, note: ''});
  vis.append('circle').attr('id', '44').attr('class', 'point').attr('r', 5).attr('cx', 303).attr('cy', 348);
  graph.node.insert({id: '45', label: 'X12', x: 354, y: 384, note: ''});
  vis.append('circle').attr('id', '45').attr('class', 'point').attr('r', 5).attr('cx', 354).attr('cy', 384);
  graph.node.insert({id: '46', label: 'COF', x: 354, y: 348, note: ''});
  vis.append('circle').attr('id', '46').attr('class', 'point').attr('r', 5).attr('cx', 354).attr('cy', 348);
  graph.node.insert({id: '47', label: 'OZ2', x: 354, y: 447, note: ''});
  vis.append('circle').attr('id', '47').attr('class', 'point').attr('r', 5).attr('cx', 354).attr('cy', 447);
  graph.node.insert({id: '48', label: 'OZ3', x: 413, y: 384, note: ''});
  vis.append('circle').attr('id', '48').attr('class', 'point').attr('r', 5).attr('cx', 413).attr('cy', 384);
  graph.node.insert({id: '49', label: 'OS1A', x: 228, y: 73, note: ''});
  vis.append('circle').attr('id', '49').attr('class', 'point').attr('r', 5).attr('cx', 228).attr('cy', 73);
  graph.node.insert({id: '50', label: 'OSM1', x: 220, y: 175, note: ''});
  vis.append('circle').attr('id', '50').attr('class', 'point').attr('r', 5).attr('cx', 220).attr('cy', 175);
  graph.node.insert({id: '51', label: 'OS2A', x: 228, y: 280, note: ''});
  vis.append('circle').attr('id', '51').attr('class', 'point').attr('r', 5).attr('cx', 228).attr('cy', 280);
  graph.node.insert({id: '52', label: 'OSM2', x: 290, y: 310, note: ''});
  vis.append('circle').attr('id', '52').attr('class', 'point').attr('r', 5).attr('cx', 290).attr('cy', 310);
  graph.node.insert({id: '53', label: 'OS3A', x: 452, y: 296, note: ''});
  vis.append('circle').attr('id', '53').attr('class', 'point').attr('r', 5).attr('cx', 452).attr('cy', 296);
  graph.node.insert({id: '54', label: 'S3', x: 413, y: 306, note: ''});
  vis.append('circle').attr('id', '54').attr('class', 'point').attr('r', 5).attr('cx', 413).attr('cy', 306);


  function ArchFindStart(gra, asd) {
    var as = [];

    for (var i = 0; i < gra.arch({start: asd}).get(0).length; i++) {
      as[i] = gra.arch({start: asd}).get(0)[i].id;
    }
    return as;
  }

  function ArchFindEnd(gra, asd) {
    var ae = [];

    for (var i = 0; i < gra.arch({end: asd}).get(0).length; i++) {
      ae[i] = gra.arch({end: asd}).get(0)[i].id;
    }
    return ae;
  }

  function Map (gra) {
    
    var road;
    var nameConsNode, start, end;
    
    road = "{";
    for (var i = 0; i < gra.node().get(0).length; i++) {

      nameConsNode = gra.node().get()[i].label;
      start = ArchFindStart(gra, nameConsNode);
      end = ArchFindEnd(gra, nameConsNode);

      road = road + gra.node().get()[i].label + ":{"; 
      
      for (var j = 0; j < start.length; j++ ) {
        if ( j != start.length - 1) {
          road = road + gra.arch({id: start[j]}).first().end + ": " + gra.arch({id: start[j]}).first().len + ", ";
        } else {
          road = road + gra.arch({id: start[j]}).first().end + ": " + gra.arch({id: start[j]}).first().len;
        }
      }
      if (start.length != 0 && end.length != 0) {
        road = road + ", ";
      }
      for (var j = 0; j < end.length; j++ ) {
        if (j != end.length - 1) {
          road = road + gra.arch({id: end[j]}).first().start + ": " + gra.arch({id: end[j]}).first().len + ", ";
        } else {
          road = road + gra.arch({id: end[j]}).first().start + ": " + gra.arch({id: end[j]}).first().len
        }
      }
      road = road + "}";
      if (i != gra.node().get(0).length - 1) {
        road = road + ","
      }
    }

    road = road + "}";

    road = JSON.stringify(eval("("+ road +")"));

    var arrayroad = JSON.parse(road);
    return arrayroad;
  }

  function lenXY (a, b) {
    var f;
    if (a >= b) {
      f = a - b;
    } else {
      f = b - a;
    }
    return f;
  }

  function ArchLength (px, py, dx, dy) {
    var l, lx, ly;
    // Take the max and min for x and y
    lx = lenXY(px, dx);
    ly = lenXY(py, dy);
    var sum = Math.pow(lx, 2) + Math.pow(ly, 2);
    l = Math.sqrt(sum);
    return parseInt(l);
  }

  /* On click of Manage Node*/
  $("#node").click(function() {
    $('#create').css("display", "none");
    $('#menagenode').css("display", "block");
  });

  /* On click of Admin Interface */
  $("#admininterface").click(function(){
    $('#create').css("display", "block");
    $("#SelInterface").css("display", "none");
  });

  $("#choiseinterface").click(function(){
    $('#create').css("display", "none");
    $("#SelInterface").css("display", "block");
  });

  /* On click of New Node*/
  $("#newnode").click(function(){
    $('#menagenode').css("display", "none");
    $('#createnode').css("display", "block");
    
    drag = d3.behavior.drag().on('drag', function() {
      $('#x').val(parseInt(d3.event.x));
      $('#y').val(parseInt(d3.event.y));
        /* move the circle */      
        return d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
    });
      vis.append('circle').attr('id', c).attr('class', 'created').attr('r', 5).attr('cx', 50).attr('cy', 40).style("fill", "red").call(drag);
      $('#assignedId').val(c);
      $('#x').val("50");
      $('#y').val("40");
      $('#label').val("N" + c);
    $('#note').val("");
  });

  /* On click of Save Node */
  $("#savenode").click(function(){
    $('#createnode').css("display", "none");
    $('#create').css("display", "block");
    var id = $('#assignedId').val();
    var x = $('#x').val();
    var y = $('#y').val();
    var label = $('#label').val();
    var note = $('#note').val();

    var nodeDel = vis.select(".created");
    nodeDel.remove();

    graph.node.insert({id: id, label: label, x: x, y: y, note: note});

    vis.append('circle').attr('id', c).attr('class', 'point').attr('r', 5).attr('cx', x).attr('cy', y);

    //graph.node().each(function (r) {console.log(r)});
    c++;

    $('#assignedId').val("");
    $('#x').val("");
    $('#y').val("");
    $('#label').val("");
    $('#note').val("");
  });

  /* On click of Cancel on New Node */
  $('#goBackNewNode').click(function(){
    $('#createnode').css("display", "none");
    $('#create').css("display", "block");

    var nodeDel = vis.select(".created");
    nodeDel.remove();

    $('#assignedId').val("");
    $('#x').val("");
    $('#y').val("");
    $('#label').val("");
    $('#note').val("");
  });

  /* On click of Modify Node*/
  $("#modnode").click(function(){
    if(graph.node().distinct("id").length >= 1) {
      $('#menagenode').css("display", "none");
      $('#modifynode').css("display", "block");

      $('.point').css("fill", "green");

      var allCircles = vis.selectAll('circle');
         
      $(allCircles[0]).bind('click', function(){
        consideredId = this.id;
        $('#assignedIdOnMod').val(this.id);
        $('#xOnMod').val(graph.node({id: this.id}).first().x);
        $('#yOnMod').val(graph.node({id: this.id}).first().y);
        $('#labelOnMod').val(graph.node({id: this.id}).first().label);
        $('#noteOnMod').val(graph.node({id: this.id}).first().note);
        drag = d3.behavior.drag().on('drag', function() {
          $('#xOnMod').val(parseInt(d3.event.x));
          $('#yOnMod').val(parseInt(d3.event.y));
            /* move the circle */      
            return d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
        });
        d3.select(this).style("fill", "red").attr("class", "selected").call(drag);
        $('.point').css("fill", "blue");
        $(allCircles[0]).unbind('click');
      });
    } else {
      alert("You have to create at least one node for modifying nodes")
    }
  });

  /* On click of Save Node of Modify */
  $('#modifySelNode').click(function(){
    $('#modifynode').css("display", "none");
    $('#create').css("display", "block");

    var idOM = $('#assignedIdOnMod').val();
    var xOM = $('#xOnMod').val();
    var yOM = $('#yOnMod').val();
    var labelOM = $('#labelOnMod').val();
    var noteOM = $('#noteOnMod').val();

    var modifynode = vis.select('.selected');
    modifynode.remove();

    
    graph.node({id: idOM}).remove();
    graph.node.insert({id: idOM, label: labelOM, x: xOM, y: yOM, note: noteOM});

    vis.append('circle').attr('id', idOM).attr('class', 'point').attr('r', 5).attr('cx', xOM).attr('cy', yOM);
    $('.point').css("fill", "blue");

    $('#assignedIdOnMod').val("");
    $('#xOnMod').val("");
    $('#yOnMod').val("");
    $('#labelOnMod').val("");
    $('#noteOnMod').val("");

    graph.node().each(function (r) {console.log(r)});
  });


  /* On click of Delete Node of Modify */
  $('#deleteSelNode').click(function(){
    $('#modifynode').css("display", "none");
    $('#create').css("display", "block");

    var deletenode = vis.select('.selected');
    var idOM = $('#assignedIdOnMod').val();
      
    var DelArchS = graph.arch({start:graph.node({id: idOM}).first().label}).get();
    var DelArchE = graph.arch({end:graph.node({id: idOM}).first().label}).get();
      
    for(var i=0; i<graph.arch({start:graph.node({id: idOM}).first().label}).count();i++){
      element = document.getElementById(DelArchS[i].id);
      if(element)element.parentNode.removeChild(element);
    }

    for(var i=0; i<graph.arch({end:graph.node({id: idOM}).first().label}).count();i++){
      element = document.getElementById(DelArchE[i].id);
      if(element)element.parentNode.removeChild(element);
    }

    graph.arch({start:graph.node({id: this.id}).first().label}).remove();
    graph.arch({end:graph.node({id: this.id}).first().label}).remove();

    deletenode.remove();
    graph.node({id: idOM}).remove();

    $('#assignedIdOnMod').val("");
    $('#xOnMod').val("");
    $('#yOnMod').val("");
    $('#labelOnMod').val("");
    $('#noteOnMod').val("");
        
    //graph.node().each(function (r) {console.log(r)});
  });

  /* On click of Cancel */
  $('#goBack').click(function(){
    $('#modifynode').css("display", "none");
    $('#menagenode').css("display", "block");

    $('.point').css("fill", "blue");

    if (consideredId != 0){
      var backposition = vis.select('.selected');
      backposition.remove();

      vis.append('circle').attr('id', consideredId)
                .attr('class', 'point')
                .attr('r', 5)
                .attr('cx', graph.node({id: consideredId}).first().x)
                .attr('cy', graph.node({id: consideredId}).first().y);
    }

    consideredId = 0;

    $('#assignedIdOnMod').val("");
    $('#xOnMod').val("");
    $('#yOnMod').val("");
    $('#labelOnMod').val("");
    $('#noteOnMod').val("");
  });

  /* On click on Cancel Manage Node */
  $("#BackToGraphN").click(function(){
    $('#menagenode').css("display", "none");
    $('#create').css("display", "block");

  });


  /* On click of Manage Arch*/
  $("#arch").click(function() {
    $('#create').css("display", "none");
    $('#menagearch').css("display", "block");


  });

  /* On click of New Arch*/
  $("#newarch").click(function() {
    if (graph.node().distinct("id").length > 1) {
      $('#menagearch').css("display", "none");
      $('#addingArch').css("display", "block");

      $('#archId').val(fixArch + varArch);

      $("#selStaNode").unbind('click');
      $("#selStaNode").click(function(){
        var allCircles = vis.selectAll('circle');

        $('.point').css("fill", "green");

        $(allCircles[0]).bind('click', function(){
          px = parseInt(graph.node({id: this.id}).first().x);
          py = parseInt(graph.node({id: this.id}).first().y);
          $("#startnode").val(graph.node({id: this.id}).first().label);
          $(allCircles[0]).unbind('click');
          $('.point').css("fill", "blue");
        });
      });

      $("#selEndNode").unbind('click');
      $("#selEndNode").click(function(){
        var allCircles = vis.selectAll('circle');

        $('.point').css("fill", "green");

        $(allCircles[0]).bind('click', function(){
          dx = parseInt(graph.node({id: this.id}).first().x);
          dy = parseInt(graph.node({id: this.id}).first().y);
          $("#endnode").val(graph.node({id: this.id}).first().label);
          $(allCircles[0]).unbind('click');
          $('.point').css("fill", "blue");
        });
      });

      $("#calLength").unbind('click');
      $("#calLength").click(function(){
        if (($("#startnode").val() != "No node") && ($("#endnode").val() != "No node")) {
          $("#length").val(ArchLength (px, py, dx, dy));

          vis.append("line").attr('id', $('#archId').val())
                    .attr('class', 'createArch')
                    .attr('x1', px)
                    .attr('y1', py)
                    .attr('x2', dx)
                    .attr('y2', dy)
                    .attr('stroke', 'black');
        } else {
          alert("You have to set the strarting and the endig nodes to calculate the lenght of link")
        }
      });


    } else {
      alert("You have to create at least two nodes to create an link");
    }
  });

  /* On click of Save Node in Create New Link */
  $('#savearch').click(function(){
    if (($("#startnode").val() != "No node") && ($("#endnode").val() != "No node") && ($("#length").val() != "Select connected nodes")) {
      $('#addingArch').css("display", "none");
      $('#create').css("display", "block");

      var arId = $('#archId').val();
      var start = $("#startnode").val();
      var end = $("#endnode").val();
      var len = $("#length").val();
      var Anote = $("#notearchs").val();

      vis.select(".createArch").remove();
      vis.append("line").attr('id', arId)
              .attr('class', 'allLine')
              .attr('x1', px)
              .attr('y1', py)
              .attr('x2', dx)
              .attr('y2', dy)
              .attr('stroke', 'black');

      graph.arch.insert({id: arId, start: start, end: end, len: len, note: Anote});
      
      $('#archId').val("");
      $("#startnode").val("No node");
      $("#endnode").val("No node");
      $("#length").val("Select connected nodes");
      $("#notearchs").val("");
      px = 0;
      dx = 0;
      py = 0;
      dy = 0;
      varArch++;

      //graph.arch().each(function (r) {console.log(r)})
    } else {
      alert("You need to insert the connected nodes and calculate the distance between them to save the link");
    }
  });

  /* On click of Cancel on Create New Link */
  $('#goBackNewArch').click(function(){
    $('#addingArch').css("display", "none");
    $('#menagearch').css("display", "block");

    vis.select(".createArch").remove();

    $('#archId').val("");
    $("#startnode").val("No node");
    $("#endnode").val("No node");
    $("#length").val("Select connected nodes");
    $("#notearchs").val("");
    px = 0;
    dx = 0;
    py = 0;
    dy = 0;
  });

  /* On click of Menu Delete Links */
  $('#modarch').click(function(){
    if(graph.arch().distinct("id").length >= 1) {
      $('#menagearch').css("display", "none");
      $('#modifyarchs').css("display", "block");

      vis.selectAll("line").attr('stroke', 'green').attr('stroke-width', '4px');
      var allArch = vis.selectAll("line");

      $(allArch[0]).bind('click', function(){
        consideredArchId = this.id;
        $("#archIdOM").val(consideredArchId);
        $('#startnodeOM').val(graph.arch({id: this.id}).first().start);
        $('#endnodeOM').val(graph.arch({id: this.id}).first().end);
        $('#lengthOM').val(graph.arch({id: this.id}).first().len);
        $('#notearchsOM').val(graph.arch({id: this.id}).first().note);

        allArch.attr('stroke', 'black').attr('stroke-width', '1px');
        d3.select(this).attr("stroke", "red").attr('stroke-width', '3px').attr("class", "selectedArch");
        d3.selectAll('.createArch').attr('stroke', 'black').attr('stroke-width', '1px');
        $(allArch[0]).unbind('click');
      });

    } else {
      alert("There isn't any link to modify")
    }
  });

  /* On click of Effective Delete Link */
  $('#deleteSelArch').click(function(){
    $('#modifyarchs').css("display", "none");
    $('#create').css("display", "block");

    var arId = $('#archIdOM').val();
    
    graph.arch({id: arId}).remove();
    vis.select('.selectedArch').remove();
      
    $('#archIdOM').val("");
    $("#startnodeOM").val("No node");
    $("#endnodeOM").val("No node");
    $("#lengthOM").val("Select connected nodes");
    $("#notearchsOM").val("");

    consideredArchId = 0;
  });

  /* On click of Cancel on Delete Link */
  $('#goBackArch').click(function(){
    $('#modifyarchs').css("display", "none");
    $('#menagearch').css("display", "block");

    $('.allLine').attr('stroke', 'black').attr('stroke-width', '1px');

    if (consideredArchId != 0) {
      vis.select(".selectedArch").remove();
      vis.append("line").attr('id', consideredArchId)
            .attr('class', 'allLine')
            .attr('x1', graph.node({label: graph.arch({id: consideredArchId }).first().start}).first().x )
            .attr('y1', graph.node({label: graph.arch({id: consideredArchId }).first().start}).first().y )
            .attr('x2', graph.node({label: graph.arch({id: consideredArchId }).first().end}).first().x )
            .attr('y2', graph.node({label: graph.arch({id: consideredArchId }).first().end}).first().y )
            .attr('stroke', 'black');

      consideredArchId = 0;

      $('#archIdOM').val("");
      $("#startnodeOM").val("No node");
      $("#endnodeOM").val("No node");
      $("#lengthOM").val("Select connected nodes");
      $("#notearchsOM").val("");
    }
  });

  /* On click on Cancel Manage Links */
  $("#BackToGraphA").click(function(){
    $('#menagearch').css("display", "none");
    $('#create').css("display", "block");

  });

  /* On click of User Interface */
  $("#userinterface").click(function(){
    if (graph.arch().distinct("id").length >= 1) {
      $("#SelInterface").css("display", "none");
      $('#UsingMapForm').css("display", "block");

      var stringForDJ = Map(graph);
        
      dijkstra = new Graph(stringForDJ);

      //console.log(dijkstra.findShortestPath('N1', 'N2'));

      $("#USERselStaNode").unbind('click');
      $("#USERselStaNode").click(function(){
        var allCircles = vis.selectAll('circle');

        $('.point').css("fill", "green");

        $(allCircles[0]).bind('click', function(){
          startpath = graph.node({id: this.id}).first().label;
          $("#USERstartnode").val(graph.node({id: this.id}).first().label);
          $(allCircles[0]).unbind('click');
          $('.point').css("fill", "blue");
        });
      });

      $("#USERselEndNode").unbind('click');
      $("#USERselEndNode").click(function(){
        var allCircles = vis.selectAll('circle');
        $('.point').css("fill", "green");

        $(allCircles[0]).bind('click', function(){
          endpath = graph.node({id: this.id}).first().label;
          $("#USERendnode").val(graph.node({id: this.id}).first().label);
          $(allCircles[0]).unbind('click');
          $('.point').css("fill", "blue");
        });
      });
    } else {
      alert("There is no map to use, create one to enter in this interface.");
    }
  });

  /* On click of Calculate path */
  $("#calculatePath").click(function(){
    if ( $("#USERstartnode").val() != "No node" || $("#USERendnode").val() == "No node" ) {
      var allpath = dijkstra.findShortestPath(startpath, endpath);

      if (allpath != null) {
        
        var distance = 0;

        for (var i = 0; i < allpath.length - 1; i++) {
          for (var j = 0; j < graph.arch().get(0).length; j++) {
            if (((graph.arch().get(0)[j].start == allpath[i]) && (graph.arch().get(0)[j].end == allpath[i + 1])) || 
              ((graph.arch().get(0)[j].start == allpath[i + 1]) && (graph.arch().get(0)[j].end == allpath[i])) )  {
              var element = document.getElementById(graph.arch().get(0)[j].id);
              distance += parseInt(graph.arch().get(0)[j].len);
              element.setAttribute("stroke", "red")
              element.setAttribute("stroke-width", "3px");
              break;
            }
          }
        }

        $("#USERlength").val(distance);

      } else {
        alert("There is no path to arrive to the selcted node");
      }
    } else {
      alert("Select the start and the end nodes to calculate the path");
    }
  }); 

  /* On click of Cancel on User Div */
  $("#goBackMain").click(function (){
    $("#SelInterface").css("display", "block");
    $('#UsingMapForm').css("display", "none");

    for (var j = 0; j < graph.arch().get(0).length; j++) {
      var element = document.getElementById(graph.arch().get(0)[j].id);
      element.setAttribute("stroke", "black")
      element.setAttribute("stroke-width", "1px");
    }

    $("#USERlength").val("");
    $("#USERendnode").val("No node");
    $("#USERstartnode").val("No node");
    
  });

  /* On click of reset */
  $("#reset").click(function(){
    $("#USERlength").val("");
    $("#USERendnode").val("No node");
    $("#USERstartnode").val("No node");

    for (var j = 0; j < graph.arch().get(0).length; j++) {
      var element = document.getElementById(graph.arch().get(0)[j].id);
      element.setAttribute("stroke", "black")
      element.setAttribute("stroke-width", "1px");
    }
  });
});