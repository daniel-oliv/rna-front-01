import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { HierarchyNode, HierarchyPointNode, Selection, TreeLayout} from 'd3';
import { offset } from 'src/app/shared/helpers/common';

let vis: TreeChartComponent;
@Component({
  selector: 'app-tree-chart',
  templateUrl: './tree-chart.component.html',
  styleUrls: ['./tree-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TreeChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: DatumTree;

  //static vis: TreeChartComponent;
  @ViewChild('chart') private chartContainer: ElementRef;
  @ViewChild('menu') private limiterMenu: ElementRef;
  isMenuVisible: boolean = false;
  // toggleClick() {
  //   this.limiterMenu.nativeElement.classList.toggle("displaynone");
  // }

  private chart: Selection<SVGGElement, any, SVGGElement, any>;
  private svg: Selection<SVGSVGElement, any, any, any>;
  private fullHeight = 450;
  private fullWidth = 400;
  private margin: any = {left:60, right:50, top:60, bottom:60};
  private width: number;
  private height: number;

  private duration = 750;
  private root: TreeNode;
  private treemap: TreeLayout<DatumTree>;
  private i;

  public limitChildren = 5;
  private selectedLimiter: TreeNode;
  limiterChildrenIDs = [];
  selectedChildID: String = '';

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
  vis = this;
  setTimeout(vis.create.bind(vis),10)
  
    // if (this.data) {
    //   this.preUpdate();
    //   this._update(this.root);
    // }
  }

  ngOnChanges() {
    // console.log('ngOnChanges');
    if (this.chart) {
      this.preUpdate();
    }
  }

  create(){
    vis = this;
    const element = this.chartContainer.nativeElement;
    console.log("offset ", offset(this.chartContainer))
    console.log("offsetWidth " + element.offsetWidth)
    console.log("offsetHeight " + element.offsetHeight)
    // this.fullWidth = element.offsetWidth;
    this.width = this.fullWidth - this.margin.left - this.margin.right;
    this.height = this.fullHeight - this.margin.top - this.margin.bottom;
    this.svg = d3.select(element).append('svg')
      // .attr('width', this.fullWidth)
      // .attr('height', this.fullHeight)
      .attr("viewBox", `0 0 ${this.fullWidth} ${this.fullHeight}`)
      .attr("class", "overlay")
      .on("click",vis.limiterClick);

    this.svg.call(this.zoomListener).on("dblclick.zoom", null);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'tree-chart')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
      // .attr('transform', `translate(${this.margin.left+this.width/2}, ${this.margin.top+this.height/2})`);

      
    // declares a tree layout and assigns the size
    // this.treemap = d3.tree().nodeSize([30,100]);
    this.treemap = d3.tree<DatumTree>().size([this.height, this.width]);
  }

  preUpdate(){
    // TODO - cab be better
    /// for id control
    this.i=0;
    // Assigns parent, children, height, depth
    this.root = <TreeNode>d3.hierarchy(this.data, function(d: DatumTree) { return d.children; });
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;
    console.log('this.root ', this.root);
    console.log('this.data ', this.data);

    /// limit the children show by default if this.limitChildren in no 0. If 0, the three will show all children when a node is "uncollapse"
    if(this.limitChildren) this.clusterExcessChildren(this.root);

    // Collapse after the second level
    this.root.children.forEach(vis.collapse);
    this._update(this.root)
    this.centerNode(this.root);
  }

  clusterExcessChildren(node: TreeNode){
    if(!node.children) return;
    for (const child of node.children) {
      this.clusterExcessChildren(child)
      this.collapse(child);
    }
    if(node.children.length > this.limitChildren){
      // console.log('node.children ', node.children.concat());
      let rest = node.children.length - this.limitChildren;
      let containerChild: TreeNode = Object.assign({},node.children[this.limitChildren]);
      //? change: children para o arrays de children em excesso
      //? tirar o excesso do node.children
      containerChild._children = node.children.splice(this.limitChildren,rest)
      containerChild.children = null;
      // console.log('node.children ', node.children.concat());
      // console.log('containerChild ', containerChild.children.concat());
      //// manter o id, x, x0, y, y0, depth, height do node.children[this.limitChildren]
      //? manter, x, x0, y, y0, depth, height do node.children[this.limitChildren]
      ///? fazer data = {COD_ID: containerChild.parent.data.COD_ID+"-limiter", type: 'limiter', name: para mostrar}
      // containerChild.data = {COD_ID: containerChild._children[0].data.COD_ID, name: excess+' a mais...', type: 'limiter'}
      containerChild.data = {COD_ID: containerChild.parent.data.COD_ID+"-limiter", name: vis.getLimiterNameLabel(rest), type: 'limiter'}

      //! CUIDADO COM _children desabilitar toggle/collapse quando o d.data.type == 'limiter'
      //? Colocar containerChild como um dos children 
      node.children.push(containerChild);
      //? filtrar os limiters antes de assinalar o nodeEnter;
      //? desenhar os filtros
    }
  }

  showSelectedLimiterChild(){
    let nodeToShow: TreeNode;
    console.log('showSelectedLimiterChild() ', vis.selectedChildID);
    for (let ind = 0; ind < this.limiterChildrenIDs.length; ind++) {
      // let child = vis.selectedLimiter._children[ind]
      if(vis.limiterChildrenIDs[ind] === vis.selectedChildID){
        nodeToShow =  vis.selectedLimiter._children.splice(ind,1)[0];
        let parentCh = vis.selectedLimiter.parent.children;
        parentCh.splice(parentCh.length-1, 0, nodeToShow);
        if(vis.selectedLimiter._children.length === 0){
          parentCh.pop();
        }
        break;
      }
    }
    
    vis._update(vis.selectedLimiter);
    // vis.centerNode(nodeToShow)
    vis.isMenuVisible = false;
  }

  showLess(){
    //TODO -fazer função mostrar menos
    console.log('showLess')
  }

  showAll(){
    console.log('showAll')
    let enterChildren = vis.selectedLimiter._children;
    let parChildren = vis.selectedLimiter.parent.children
    // adiciona os nós que vão ser mostrados à lista do nó pai e deleta o limiter
    parChildren.splice(parChildren.length-1,1,...enterChildren);
    vis._update(vis.selectedLimiter);
    vis.centerNode(vis.selectedLimiter.parent)
    vis.isMenuVisible = false;
  }

  showMore(){
    console.log('showMore')
    let enterChildren = vis.selectedLimiter._children.splice(0,this.limitChildren);
    let parChildren = vis.selectedLimiter.parent.children
    let rest = vis.selectedLimiter._children.length;
    // adiciona os nós que vão ser mostrados à lista do nó pai
    parChildren.splice(parChildren.length-1,0,...enterChildren);
    if(rest > 0){// se ainda há nós escondidos, mostrar muda o nome do limiter
      vis.selectedLimiter.data.name = vis.getLimiterNameLabel(rest);
    }else{ // senão, destacarta o limiter
      parChildren.pop();
    }
    /// talvez trocar pelo filho que ocupa o lugar no limiter e para os nós acima dele acho que nem precisa
    vis.isMenuVisible = false;
    vis._update(vis.selectedLimiter);
  }

  getLimiterNameLabel(length: number){
    return length+' a mais...';
  }
  
  private _update(source){
    vis=this;
    
    var levelWidth = [1];
    var childCount = function(level, n) {

        if (n.children && n.children.length > 0) {
            if (levelWidth.length <= level + 1) levelWidth.push(0);

            levelWidth[level + 1] += n.children.length;
            n.children.forEach(function(d: TreeNode) {
                childCount(level + 1, d);
            });
        }
    };
    childCount(0, this.root);
    var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
    this.treemap = this.treemap.size([newHeight, this.width]);
    
    // console.log('update() data ', this.data);
    // console.log('update() source ', source );    

    // Assigns the x and y position for the nodes
    let treeData = this.treemap(this.root);
    console.log('treeData ', treeData);

    // Compute the new tree layout.
    let nodes = <TreeNode[]>treeData.descendants();
    let links = treeData.descendants().slice(1);
    // console.log('links   ', links );
    console.log('nodes ', nodes);
    // Normalize for fixed-depth.
    nodes.forEach(function(d: TreeNode){ d.y = d.depth * 180});

    // ****************** Nodes section ***************************

    // Update the nodes...
    let node = (this.chart.selectAll('g.node')
      .data(nodes, function(d: TreeNode) {return d.data.COD_ID/* d.id || (d.id = (++vis.i)+""); */ })) as Selection<SVGGElement, TreeNode, SVGGElement, any>;
    console.log('i ', vis.i);
    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d: TreeNode) {
        console.log('transform ', d.data.name)
        return "translate(" + source.y0 + "," + source.x0 + ")";
      });
    // console.log('nodeEnter ', nodeEnter);
    let datumNodeEnter = nodeEnter.filter(d=>d.data.type!=='limiter')
      .on('click', vis.click);
    let limiterNodeEnter = nodeEnter.filter(d=>d.data.type==='limiter')
      .on('click', vis.limiterClick);
    // Add Circle for the nodes
    datumNodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d: TreeNode) {
          return d._children ? "lightsteelblue" : "#fff";
      });


    limiterNodeEnter.append('rect')
    .attr('class', 'node')
    .attr('height', 2*10)
    .attr('width', 75)
    .attr("x",-75+10)
    .attr("y",-10)
    .style("fill", function(d: TreeNode) {
        return d._children ? "lightsteelblue" : "#fff";
    });

    // Add labels for the nodes
    datumNodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d: TreeNode) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d: TreeNode) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d: TreeNode) { return d.data.name; });

      // Add labels for the limiter nodes
      limiterNodeEnter.append('text')
      .attr("dy", ".35em")
      // .attr("x", function(d: TreeNode) {return  5;})
      .attr("text-anchor", function(d: TreeNode) {
          return "end" ;
      })
      .text(function(d: TreeNode) { return d.data.name; });

    // UPDATE
    let nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.duration)
      .attr("transform", function(d: TreeNode) { 
          return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style("fill", function(d: TreeNode) {
          return d._children ? "lightsteelblue" : "#fff";
      })
      .attr('cursor', 'pointer');


    // Remove any exiting nodes
    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function(d: TreeNode) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();
    //? Optional procedure - just visual and can be removed for performance improving
    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
      .attr('r', 1e-6);
    // On exit reduce the node rect width to 0
    nodeExit.select('rect')
      .attr('width', 1e-6)
      .attr('height', 1e-6)
      // .attr('fill-opacity', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
      
    // ****************** links section ***************************
    // Update the links...
    let link = <Selection<SVGPathElement, HierarchyPointNode<DatumTree>, SVGGElement, any>>
      this.chart.selectAll('path.link')
        .data(links, function(d: TreeNode) { return d.data.COD_ID; });
    
    // Enter any new links at the parent's previous position.
    let linkEnter = link.enter().insert('path', "g")
    .attr("class", "link")
    .attr('d', function(d: TreeNode){
      var o = {x: source.x0, y: source.y0}
      // console.log('o ', o);
      return vis.diagonal(o, o)
    });

    // UPDATE
    let linkUpdate = linkEnter.merge(link);
    
    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', function(d: TreeNode){ return vis.diagonal(d, d.parent) });

    // Remove any exiting links
    let linkExit = link.exit().transition()
    .duration(this.duration)
    .attr('d', function(d: TreeNode) {
      let o = {x: source.x, y: source.y}
      return vis.diagonal(o, o)
    })
    .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });


  }

  diagonal(s, d) {
    // console.log('s ', s);
    // console.log('d ', d);
    let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  click(d: TreeNode) {
    console.log('click()')
    // console.log('click d ', d);
    if (d3.event.defaultPrevented) return; // click suppressed
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    vis._update(d);
    vis.centerNode(d);
  }

  // Show actions on click.
  limiterClick(d: TreeNode) { 
    // console.log('limiterClick', d);
    console.log(d3.event.pageX + "-" + d3.event.pageY)
    if(d && d.data && d.data.type == 'limiter'){
      vis.isMenuVisible = true;
      vis.selectedLimiter = d;
      vis.limiterChildrenIDs = d._children.map(d=>d.data.COD_ID);
      vis.selectedChildID = '';
      let nativeEl = vis.limiterMenu.nativeElement;
      console.log('nativeEl.offsetHeight ', nativeEl.offsetHeight);
      const completeOffSet =  offset(vis.chartContainer)
      console.log("completeOffSet ", completeOffSet)
      nativeEl.style.left = (d3.event.pageX  -completeOffSet.left+20) + 'px';
      nativeEl.style.top = (d3.event.pageY - completeOffSet.top + 80) + 'px';
      // nativeEl.style.left = d3.event.pageX+'px';
      // nativeEl.style.top = d3.event.pageY+'px';
      // nativeEl.style.left = (d3.event.pageX-370)+'px';
      // nativeEl.style.top = (d3.event.pageY-188)+'px';
      // nativeEl.style.left = (d3.event.pageX-this.fullWidth)+'px';
      // nativeEl.style.top = (d3.event.pageY-this.fullHeight)+'px';
      d3.event.stopPropagation();
    }
    else{
      vis.isMenuVisible = false;
    }
  }
  resetSearchLimiterMenu(){
    // vis.limiterChildrenIDs = [];
    // vis.selectedChildID = '';
    // this.selectedLimiter = undefined;
    this.isMenuVisible = false;
  }
  
  collapse(d: TreeNode) {
    // if(vis.isLimiter(d)){} return;
    if(d.children) {
      d._children = d.children
      d._children.forEach(vis.collapse)
      d.children = null
    }
  }
   zoom() {
    vis.resetSearchLimiterMenu()
    vis.chart.attr("transform", d3.event.transform);
    // this.chart.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", this.zoom);

  centerNode(source) {
    let t = d3.zoomTransform(vis.svg.node());
    let x = -source.y0;
    let y = -source.x0;
    // x = x * t.k + this.width / 2;
    x = x * t.k + this.width / 4;
    y = y * t.k + this.height / 2;
    this.svg.transition().duration(this.duration).call( <any>vis.zoomListener.transform, d3.zoomIdentity.translate(x,y).scale(t.k) );
  }

  isLimiter(d:TreeNode){
    if(d.data.type === 'limiter') return true;
    return false;
  }
}


export interface DatumTree{
  name: string,
  children?: DatumTree[],
  type?
  COD_ID?: string
}

interface TreeNode extends HierarchyPointNode<DatumTree>{
  x0?: number,
  y0?: number,
  // id?: string
  _children: TreeNode[]
}