"""Recover the official wave A centerlines without modifying the PNG.

Offline asset preparation only; the site build uses the checked-in JSON.
Requires NumPy and Pillow. Run from any directory with Python 3.
The source PNG is independently checked against the design team's original
by audit-rendered.mjs; do not substitute a different input image.
"""
from pathlib import Path
from collections import Counter
from PIL import Image
import numpy as np

root=Path(__file__).resolve().parents[1]
source=root/'public/assets/brand/wave-a.png'
a=np.array(Image.open(source).convert('RGBA'))
colors=[rgb for rgb,n in Counter(map(tuple,a[a[:,:,3]>160,:3])).most_common() if n>500]
# Each of the 22 original solid ink colors identifies a separate centerline.
paths=[]

for rgb in colors:
 yy,xx=np.where(np.all(a[:,:,:3]==rgb,axis=2)&(a[:,:,3]>32))
 points=np.stack((xx,yy),axis=1).astype(float)
 # Alpha-weighted subpixel centers in small cells reduce raster quantization.
 cell=np.floor(points/3).astype(int)
 _,labels=np.unique(cell,axis=0,return_inverse=True)
 weights=a[yy,xx,3].astype(float)
 sums=np.bincount(labels,weights=weights)
 pts=np.stack([np.bincount(labels,weights=weights*points[:,j])/sums for j in range(2)],axis=1)
 n=len(pts)
 d2=((pts[:,None,:]-pts[None,:,:])**2).sum(axis=2)
 np.fill_diagonal(d2,np.inf)
 near=np.argpartition(d2,8,axis=1)[:,:8]
 edges=sorted({(float(d2[i,j]),min(i,int(j)),max(i,int(j))) for i,row in enumerate(near) for j in row})
 parent=list(range(n));adj=[[] for _ in range(n)]
 def find(i):
  while parent[i]!=i:
   parent[i]=parent[parent[i]];i=parent[i]
  return i
 def join(i,j):
  x,y=find(i),find(j)
  if x==y:return False
  parent[x]=y;length=float(np.linalg.norm(pts[i]-pts[j]));adj[i].append((j,length));adj[j].append((i,length));return True
 for _,i,j in edges:join(i,j)
 while len(set(find(i) for i in range(n)))>1:
  groups=np.array([find(i) for i in range(n)])
  distance=np.where(groups[:,None]!=groups[None,:],d2,np.inf)
  i,j=np.unravel_index(np.argmin(distance),distance.shape);join(int(i),int(j))
 def farthest(start):
  dist=[-1.]*n;prev=[-1]*n;dist[start]=0;stack=[start]
  while stack:
   i=stack.pop()
   for j,d in adj[i]:
    if dist[j]<0:dist[j]=dist[i]+d;prev[j]=i;stack.append(j)
  return int(np.argmax(dist)),prev
 end,_=farthest(0);start,prev=farthest(end);indices=[start]
 while indices[-1]!=end:indices.append(prev[indices[-1]])
 line=pts[indices]
 # Light symmetric smoothing removes 1px raster stair steps, then simplify.
 padded=np.pad(line,((3,3),(0,0)),mode='edge')
 smooth=np.array([padded[i:i+7].mean(axis=0) for i in range(len(line))])
 smooth[0]=line[0];smooth[-1]=line[-1]
 # Least-squares cubic B-spline removes raster stair steps while retaining
 # the original trajectory. Control count adapts to fitting error.
 if smooth[0,0]>smooth[-1,0]:smooth=smooth[::-1]
 arc=np.r_[0,np.cumsum(np.linalg.norm(np.diff(smooth,axis=0),axis=1))];arc/=arc[-1]
 def basis(t,degree,knots):
  t=np.clip(np.asarray(t),0,1-1e-12)
  vals=((t[:,None]>=knots[:-1])&(t[:,None]<knots[1:])).astype(float)
  for k in range(1,degree+1):
   count=len(knots)-k-1;out=np.zeros((len(t),count))
   for j in range(count):
    left=knots[j+k]-knots[j];right=knots[j+k+1]-knots[j+1]
    if left:out[:,j]+=(t-knots[j])/left*vals[:,j]
    if right:out[:,j]+=(knots[j+k+1]-t)/right*vals[:,j+1]
   vals=out
  return vals
 for controls in [20,28,36,44,52,64]:
  knots=np.r_[[0]*4,np.linspace(0,1,controls-2)[1:-1],[1]*4]
  mat=basis(arc,3,knots);fitted=np.linalg.lstsq(mat,smooth,rcond=None)[0]
  error=np.linalg.norm(mat@fitted-smooth,axis=1)
  if np.quantile(error,.95)<.9:break
 def point(t):return (basis([t],3,knots)@fitted)[0]
 def slope(t):
  lo=max(0,t-1e-6);hi=min(1,t+1e-6)
  return (point(hi)-point(lo))/(hi-lo)
 def f(v):return f'{v:.2f}'.rstrip('0').rstrip('.')
 simple=np.array([point(t) for t in np.unique(knots)])
 d='M'+','.join(f(v) for v in simple[0])
 intervals=np.unique(knots)
 for lo,hi in zip(intervals[:-1],intervals[1:]):
  c1=point(lo)+slope(lo)*(hi-lo)/3;c2=point(hi)-slope(hi)*(hi-lo)/3
  d+=' C'+','.join(f(v) for v in [*c1,*c2,*point(hi)])
 paths.append({'d':d,'rgb':[int(v) for v in rgb]})

import json
output=root/'src/data/wave-a-centerlines.json'
output.write_text(json.dumps({
 'source':'Ejemplo curvas.png — equipo de diseño, 2026-08-20',
 'viewBox':[0,0,1454,1339],
 'lines':paths,
},ensure_ascii=False,indent=2)+'\n')
print(f'Recovered {len(paths)} trajectories: {output}')
