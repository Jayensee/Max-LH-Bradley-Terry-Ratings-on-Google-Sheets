class Graph {
  constructor() {
    this.vertices=new Array()
    this.edges=new Array()
  }
  addVertex(vertexName){
    this.vertices.push(vertexName)
    this.edges[this.vertices.length-1]=[]

  }
  addEdge(v1, v2){
    this.edges[this.vertices.indexOf(v1)].push(v2)
  }
}

class VertexTarjan {
  constructor(name, index, lowlink, adj) {
    this.name=name
    this.index=index
    this.lowlink=lowlink
    this.adj=adj
  }
}


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function printGraph(graph){
  ret=new Array()
  for(i=0;i<graph.edges.length;i++){
    ret.push([graph.vertices[i]])
    for(j=0;j<graph.edges[i].length;j++){
      ret[ret.length-1].push(graph.edges[i][j]) 
    }
  }
  return ret
}

function createGraphFromWinsGrid(winsGrid,prnt=false){
  graph= new Graph()
  for(i=1;i<winsGrid.length;i++){
    graph.addVertex(winsGrid[0][i])
  }
  for(i=1;i<winsGrid.length;i++){
    for(j=1;j<winsGrid.length;j++){
      if(winsGrid[i][j]>0){
        graph.addEdge(winsGrid[0][i],winsGrid[0][j])
      }
    }
  }
  // console.log(graph)
  if(prnt){
    return printGraph(graph)
  }
  return graph
}

function fml2(x){
  return fml(x)
}

function fml(x){
  if(x>100){
    return x
  }

  const v=x+30
  console.log("in", v)
  ret=fml(v)
  // Se se tirar a seguinte linha o v no out fica sempre igual
  // v=x+30
  console.log("out", v)

  return ret
}

function explore(at, stack, unexplored, allVertices, index, scc){
  at.index=index
  at.lowlink=index
  index++
  unexplored.splice(unexplored.findIndex(element => element.name==at.name), 1)
  stack.push(at)
  
  for(const name of at.adj){
    
    let to=unexplored.find(element => element.name==name)
  
    if(to!=undefined){
      console.log("In", at, name)
      index=explore(to, stack, unexplored, allVertices, index, scc) 
      
      // to=allVertices.find(element => element.name==name)
      console.log("Out", at, name)
      
      
      if(stack.find(element => element.name==to.name)){
        at.lowlink=Math.min(at.lowlink, to.lowlink)
      }
    }
    else{
      to=stack.find(element => element.name==name) 
      if(to!=undefined){
        at.lowlink=Math.min(at.lowlink, to.lowlink) 
      }
    }
  }

  if(at.index==at.lowlink){
    newScc=new Array()
    newScc.push(stack.pop())
    while(newScc[newScc.length-1].name!=at.name){
      newScc.push(stack.pop())
    }
    scc.push(newScc)
  }

  return index
}

function tarjan(graph){
  index=0
  stack=new Array()
  scc=new Array()
  unexplored=new Array()
  allVertices=new Array()
  for(v in graph.vertices){
    unexplored.push(new VertexTarjan(graph.vertices[v], -1, -1, graph.edges[v]))    
    allVertices.push(unexplored[unexplored.length-1])
  }
  // console.log(allVertices)
  // console.log(unexplored)
  while(unexplored.length>0){
    // console.log(unexplored)
    index=explore(unexplored[unexplored.length-1], stack, unexplored, allVertices, index, scc)
  }

  return scc
}

function createWinsGridsArray(winsGrid, scc){
  winsGridsArray=new Array()
  for(c of scc){
    // console.log(c)
    newGrid=new Array()
    toRemove=new Array()

    for(i=1;i<winsGrid.length;i++){
      if(c.find(element => element.name==winsGrid[0][i])==undefined){
        
        toRemove.unshift(i)
      }
    
    }
    // console.log(toRemove)
    for(i=0;i<winsGrid.length;i++){
      if(toRemove.find(element => element==i)==undefined){
        toPush=JSON.parse(JSON.stringify(winsGrid[i]))
        // console.log(toPush)
        for(j of toRemove){
          toPush.splice(j,1)
        }
        // console.log(toPush)
        newGrid.push(toPush)
      }
    }
    // console.log(newGrid)
    winsGridsArray.push(newGrid)
  }
  // console.log(winsGridsArray)
  return winsGridsArray
}

/**
 * Calculates the Bradley-Terry ratings that maximize the likelihood of the match outcomes given.
 *
 * @param The table of wins including the team names in both the columns and rows.
 * @param The number of iterations.
 * @return The ratings, sorted the same way as the rows.
 * @customfunction
 */
function calculateMaxLHRatings(winsGrid, iters=1000){
  graph=createGraphFromWinsGrid(winsGrid)
  scc=tarjan(graph)
  // console.log(scc)
  sccR=new Array()
  sccNames=new Array()
  winsGridsArray=createWinsGridsArray(winsGrid, scc)
  output=[["Team", "BT", "Elo"]]

  for(sccWinsGrid of winsGridsArray){
    r = new Array(sccWinsGrid.length-1)
    r.fill(1)
    games = new Array(sccWinsGrid.length-1).fill(0).map(() => new Array(sccWinsGrid.length-1).fill(0));
    wins = new Array(sccWinsGrid.length-1).fill(0)
    for (i=0;i<games.length;i++){
      for (j=0;j<games.length;j++){
        games[i][j]+=(sccWinsGrid[i+1][j+1]+sccWinsGrid[j+1][i+1])/2
        games[j][i]+=(sccWinsGrid[i+1][j+1]+sccWinsGrid[j+1][i+1])/2
        wins[i]+=sccWinsGrid[i+1][j+1]
      }
    }

    singleFlag=false
    s=0
    for(game of games){
      s+=game
    }
    if(wins[0]==0 || wins[0]==s) singleFlag=true
    
    for (iter=0;iter<iters;iter++){
      if(singleFlag) break
      r2 = new Array(r.length)
      r3 = new Array(r.length)
      // for (i=0;i<r.length;i++){
      //   prod*=r[i]
      // }
      reducer = (accumulator, curr) => accumulator * curr
      prod=Math.pow(r.reduce(reducer), 1/r.length)
      for (i=0;i<r.length;i++){
        r2[i]=wins[i]
        
        s=0
        for (j=0;j<r.length;j++){
          s+=games[i][j]/(r[i]+r[j])
        }
        console.log("name",sccWinsGrid[0][i+1])
        console.log("sum",s)
        console.log("prevr",r2[i])
        console.log("wins",wins[i])
        r2[i]/=(s*prod)
      }
      mse=0
      for(id in r){
        mse+=Math.pow(r2-r, 2)/r.length
      }

    	r=r2
    }
    reducer = (accumulator, curr) => accumulator * curr
    prod=Math.pow(r.reduce(reducer), 1/r.length)

    for (i=0;i<r.length;i++){
      r[i]/=(prod)
    }

    sccWinsGrid[0].shift()

    for (id in sccWinsGrid[0]){
      output.push([])
      output[output.length-1].push(sccWinsGrid[0][id])
      output[output.length-1].push(r[id])
      output[output.length-1].push(400*Math.log10(r[id])+1500)
    }
    output.push("###")

  }
  output.pop()
  return output
}

function odds (bestof, w) {
  // bo1=1/(1+ Math.pow(10, ((r2-r1)/400)));
  bo1=w;
  
  wt=0;
  
  for(n=0; n<bestof/2; n++) {
    wt+=pt(Math.ceil(bestof/2), n, bo1)
  }
  
  return wt;
}

function pt (a, y, x) {
  if (a>y) {
    return Math.pow(x, a)*Math.pow((1-x), y) * nCr(a+y-1, a-1);
  }
  
  else {
    return Math.pow(x, a)*Math.pow((1-x), y) * nCr(a+y-1, y-1);
  }
}
  
function nCr (n, r) {
  return fct(n)/(fct(r)*fct(n-r))
}

function fct (n) {
  i1=n;
  i2=1
  while (i1>0) {
    i2=i2*i1;
    i1=i1-1;
  }
  return i2;
}

