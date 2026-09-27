(() => {
  const host = document.querySelector('.about-logo-3d');
  const canvas = host?.querySelector('.about-logo-canvas');
  const symbol = host?.closest('.about-spec-symbol');
  const orbit = symbol?.querySelector('.symbol-orbit');
  if (!host || !canvas) return;

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: true,
    depth: true,
    powerPreference: 'high-performance',
    premultipliedAlpha: false
  });
  if (!gl) return;

  // Exact vector trace supplied in generate_3d_ostrelya_emblem.py.
  const ringTopLeft = [
    [-.0472,2.0283],[.1509,2.0283],[.3774,2.0047],[.7075,1.9198],[.9906,1.7925],[1.1085,1.717],[1.1368,1.6887],[1.1509,1.6557],[1.1415,1.5991],[1.066,1.5236],[.9104,1.3962],[.8774,1.3821],[.8019,1.3915],[.6415,1.4811],[.5142,1.5283],[.2736,1.5802],[-.0189,1.5896],[-.2689,1.5519],[-.4906,1.4811],[-.7123,1.3726],[-.9104,1.2358],[-1.1132,1.0472],[-1.3019,.8019],[-1.4057,.6038],[-1.4953,.3349],[-1.533,.0802],[-1.533,-.1698],[-1.5047,-.3585],[-1.4198,-.6038],[-1.3443,-.7453],[-1.283,-.8349],[-1.2736,-.9151],[-1.2877,-.9434],[-1.5189,-1.1604],[-1.5566,-1.1745],[-1.6179,-1.1604],[-1.7028,-1.0472],[-1.7972,-.8868],[-1.9151,-.6038],[-1.9575,-.4481],[-1.9858,-.2877],[-2,.0142],[-1.9858,.1934],[-1.9528,.3821],[-1.9151,.5236],[-1.8349,.7453],[-1.7028,1],[-1.5472,1.2264],[-1.4481,1.3443],[-1.2925,1.5],[-1.1462,1.6226],[-.9009,1.783],[-.6085,1.9151],[-.3349,1.9906],[-.0519,2.0236]
  ];
  const ringBottomRight = [
    [1.8208,.4528],[1.8868,.4387],[1.9198,.4009],[1.9764,.1604],[2,-.066],[2,-.2689],[1.9764,-.4906],[1.9151,-.7358],[1.8302,-.9434],[1.6792,-1.2028],[1.533,-1.3868],[1.3443,-1.5708],[1.1321,-1.7264],[.8962,-1.8538],[.6179,-1.9528],[.4528,-1.9906],[.2594,-2.0189],[.0943,-2.0283],[-.1179,-2.0236],[-.3868,-1.9858],[-.4198,-1.9623],[-.434,-1.934],[-.434,-1.8868],[-.4245,-1.8632],[-.2217,-1.6274],[-.1651,-1.5849],[-.1085,-1.5802],[.0142,-1.5943],[.2547,-1.5849],[.3821,-1.5613],[.5613,-1.5094],[.717,-1.4434],[.8962,-1.3396],[1.066,-1.2075],[1.1981,-1.0755],[1.2736,-.9811],[1.3679,-.8349],[1.434,-.6981],[1.4906,-.5283],[1.5283,-.2925],[1.5236,-.0943],[1.4858,.0896],[1.4953,.1462],[1.7783,.434],[1.816,.4481]
  ];
  const arrow = [
    [2.4151,2.2358],[2.4387,2.2311],[2.434,2.2123],[2.2358,1.9198],[1.4151,.7925],[.5236,-.3726],[-.1321,-1.1934],[-.1604,-1.2028],[-.1651,-1.1745],[-.0896,-.684],[-.1038,-.6462],[-.1509,-.6038],[-.1887,-.5943],[-.2358,-.5991],[-1,-.8726],[-1.0283,-.8726],[-1.0283,-.8538],[.2736,.283],[2.4104,2.2311]
  ];

  const vertexShader = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute float aMix;
    uniform mat4 uModel;
    uniform mat4 uViewProjection;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vMix;
    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      vWorld = world.xyz;
      vNormal = normalize(mat3(uModel) * aNormal);
      vMix = aMix;
      gl_Position = uViewProjection * world;
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uMetallic;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vMix;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightA = normalize(vec3(-0.52, 0.76, 1.0));
      vec3 lightB = normalize(vec3(0.82, -0.22, 0.58));
      vec3 viewDir = normalize(vec3(0.0, 0.0, 8.0) - vWorld);
      float diffuse = max(dot(normal, lightA), 0.0);
      float fill = max(dot(normal, lightB), 0.0);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.2);
      float specular = pow(max(dot(reflect(-lightA, normal), viewDir), 0.0), mix(42.0, 92.0, uMetallic));
      vec3 base = mix(uColorA, uColorB, smoothstep(0.0, 1.0, vMix));
      vec3 color = base * (0.40 + diffuse * 0.66 + fill * 0.18);
      color += vec3(specular * (0.16 + uMetallic * 0.46));
      color += mix(base, vec3(0.72, 0.79, 1.0), 0.38) * fresnel * 0.12;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function shader(type, source) {
    const item = gl.createShader(type);
    gl.shaderSource(item, source);
    gl.compileShader(item);
    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(item));
    return item;
  }

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn('Ostrelya 3D fallback:', error);
    return;
  }

  function polygonArea(points) {
    return points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point[0] * next[1] - next[0] * point[1];
    }, 0) * 0.5;
  }

  function insideTriangle(point, a, b, c) {
    const cross = (p1, p2, p3) => (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
    const d1 = cross(point, a, b);
    const d2 = cross(point, b, c);
    const d3 = cross(point, c, a);
    const epsilon = 0.000001;
    return (d1 > epsilon && d2 > epsilon && d3 > epsilon) || (d1 < -epsilon && d2 < -epsilon && d3 < -epsilon);
  }

  function triangulate(points) {
    const order = points.map((_, index) => index);
    if (polygonArea(points) < 0) order.reverse();
    const triangles = [];
    let safety = points.length * points.length;
    while (order.length > 3 && safety-- > 0) {
      let clipped = false;
      for (let index = 0; index < order.length; index += 1) {
        const previous = order[(index - 1 + order.length) % order.length];
        const current = order[index];
        const next = order[(index + 1) % order.length];
        const a = points[previous], b = points[current], c = points[next];
        const convex = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
        if (convex <= 0.0000001) continue;
        let contains = false;
        for (const candidate of order) {
          if (candidate !== previous && candidate !== current && candidate !== next && insideTriangle(points[candidate], a, b, c)) {
            contains = true;
            break;
          }
        }
        if (contains) continue;
        triangles.push([previous, current, next]);
        order.splice(index, 1);
        clipped = true;
        break;
      }
      if (!clipped) break;
    }
    if (order.length === 3) triangles.push([order[0], order[1], order[2]]);
    return triangles;
  }

  function extrude(points, depth, zOffset = 0, bevelDepth = 0.04, bevelSegments = 6) {
    const positions = [];
    const normals = [];
    const mixes = [];
    // True center of the complete source emblem bounds.
    const centerX = 0.21935;
    const centerY = 0.10375;
    const minMix = -3.1;
    const maxMix = 4.7;
    const push = (point, z, normal) => {
      positions.push(point[0] - centerX, point[1] - centerY, z + zOffset);
      normals.push(...normal);
      mixes.push(Math.max(0, Math.min(1, (point[0] + point[1] - minMix) / (maxMix - minMix))));
    };

    const ccw = polygonArea(points) > 0;
    const centroid = points.reduce((sum, point) => [sum[0] + point[0], sum[1] + point[1]], [0, 0]).map(value => value / points.length);
    const edgeNormals = points.map((point, index) => {
      const next = points[(index + 1) % points.length];
      const dx = next[0] - point[0];
      const dy = next[1] - point[1];
      const length = Math.hypot(dx, dy) || 1;
      return ccw ? [dy / length, -dx / length] : [-dy / length, dx / length];
    });
    const vertexNormals = points.map((_, index) => {
      const previous = edgeNormals[(index - 1 + points.length) % points.length];
      const current = edgeNormals[index];
      const x = previous[0] + current[0];
      const y = previous[1] + current[1];
      const length = Math.hypot(x, y) || 1;
      return [x / length, y / length];
    });
    const insetVectors = points.map(point => {
      const x = centroid[0] - point[0];
      const y = centroid[1] - point[1];
      const length = Math.hypot(x, y) || 1;
      return [x / length, y / length];
    });
    const insetPoints = points.map((point, index) => [
      point[0] + insetVectors[index][0] * bevelDepth,
      point[1] + insetVectors[index][1] * bevelDepth
    ]);
    const halfDepth = depth * 0.5;
    const bodyFront = halfDepth - bevelDepth;
    const bodyBack = -halfDepth + bevelDepth;

    for (const triangle of triangulate(insetPoints)) {
      triangle.forEach(index => push(insetPoints[index], halfDepth, [0, 0, 1]));
      [...triangle].reverse().forEach(index => push(insetPoints[index], -halfDepth, [0, 0, -1]));
    }

    points.forEach((point, index) => {
      const nextIndex = (index + 1) % points.length;
      const next = points[nextIndex];
      const sideNormal = [...edgeNormals[index], 0];
      push(point, bodyFront, sideNormal); push(point, bodyBack, sideNormal); push(next, bodyBack, sideNormal);
      push(point, bodyFront, sideNormal); push(next, bodyBack, sideNormal); push(next, bodyFront, sideNormal);

      for (let segment = 0; segment < bevelSegments; segment += 1) {
        const theta0 = (segment / bevelSegments) * Math.PI * 0.5;
        const theta1 = ((segment + 1) / bevelSegments) * Math.PI * 0.5;
        const profile = (source, inset, theta) => [
          source[0] + (inset[0] - source[0]) * (1 - Math.cos(theta)),
          source[1] + (inset[1] - source[1]) * (1 - Math.cos(theta))
        ];
        const current0 = profile(point, insetPoints[index], theta0);
        const current1 = profile(point, insetPoints[index], theta1);
        const next0 = profile(next, insetPoints[nextIndex], theta0);
        const next1 = profile(next, insetPoints[nextIndex], theta1);
        const currentNormal0 = [vertexNormals[index][0] * Math.cos(theta0), vertexNormals[index][1] * Math.cos(theta0), Math.sin(theta0)];
        const currentNormal1 = [vertexNormals[index][0] * Math.cos(theta1), vertexNormals[index][1] * Math.cos(theta1), Math.sin(theta1)];
        const nextNormal0 = [vertexNormals[nextIndex][0] * Math.cos(theta0), vertexNormals[nextIndex][1] * Math.cos(theta0), Math.sin(theta0)];
        const nextNormal1 = [vertexNormals[nextIndex][0] * Math.cos(theta1), vertexNormals[nextIndex][1] * Math.cos(theta1), Math.sin(theta1)];
        const front0 = bodyFront + bevelDepth * Math.sin(theta0);
        const front1 = bodyFront + bevelDepth * Math.sin(theta1);
        const back0 = bodyBack - bevelDepth * Math.sin(theta0);
        const back1 = bodyBack - bevelDepth * Math.sin(theta1);

        push(current0, front0, currentNormal0); push(next0, front0, nextNormal0); push(next1, front1, nextNormal1);
        push(current0, front0, currentNormal0); push(next1, front1, nextNormal1); push(current1, front1, currentNormal1);

        const backCurrentNormal0 = [currentNormal0[0], currentNormal0[1], -currentNormal0[2]];
        const backCurrentNormal1 = [currentNormal1[0], currentNormal1[1], -currentNormal1[2]];
        const backNextNormal0 = [nextNormal0[0], nextNormal0[1], -nextNormal0[2]];
        const backNextNormal1 = [nextNormal1[0], nextNormal1[1], -nextNormal1[2]];
        push(current0, back0, backCurrentNormal0); push(next1, back1, backNextNormal1); push(next0, back0, backNextNormal0);
        push(current0, back0, backCurrentNormal0); push(current1, back1, backCurrentNormal1); push(next1, back1, backNextNormal1);
      }
    });
    return { positions: new Float32Array(positions), normals: new Float32Array(normals), mixes: new Float32Array(mixes), count: positions.length / 3 };
  }

  function createMesh(points, depth, zOffset, bevelDepth, colorA, colorB, metallic) {
    const geometry = extrude(points, depth, zOffset, bevelDepth, 6);
    const position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.positions, gl.STATIC_DRAW);
    const normal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normal);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.normals, gl.STATIC_DRAW);
    const mix = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mix);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.mixes, gl.STATIC_DRAW);
    return { position, normal, mix, count: geometry.count, colorA, colorB, metallic };
  }

  function smoothClosedPolygon(points, passes = 2) {
    let refined = points.map(point => [...point]);
    for (let pass = 0; pass < passes; pass += 1) {
      const nextPass = [];
      refined.forEach((point, index) => {
        const next = refined[(index + 1) % refined.length];
        nextPass.push([
          point[0] * 0.75 + next[0] * 0.25,
          point[1] * 0.75 + next[1] * 0.25
        ]);
        nextPass.push([
          point[0] * 0.25 + next[0] * 0.75,
          point[1] * 0.25 + next[1] * 0.75
        ]);
      });
      refined = nextPass;
    }
    return refined;
  }

  const meshes = [
    createMesh(smoothClosedPolygon(ringTopLeft), 0.24, 0, 0.045, [0.025, 0.03, 0.04], [0.105, 0.12, 0.16], 0.24),
    createMesh(smoothClosedPolygon(ringBottomRight), 0.24, 0, 0.045, [0.025, 0.03, 0.04], [0.105, 0.12, 0.16], 0.24),
    createMesh(arrow, 0.30, 0.10, 0.035, [0.01, 0.22, 1.0], [0.48, 0.02, 1.0], 0.62)
  ];

  const locations = {
    position: gl.getAttribLocation(program, 'aPosition'),
    normal: gl.getAttribLocation(program, 'aNormal'),
    mix: gl.getAttribLocation(program, 'aMix'),
    model: gl.getUniformLocation(program, 'uModel'),
    viewProjection: gl.getUniformLocation(program, 'uViewProjection'),
    colorA: gl.getUniformLocation(program, 'uColorA'),
    colorB: gl.getUniformLocation(program, 'uColorB'),
    metallic: gl.getUniformLocation(program, 'uMetallic')
  };

  const multiply = (a, b) => {
    const out = new Float32Array(16);
    for (let column = 0; column < 4; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        out[column * 4 + row] = a[row] * b[column * 4] + a[4 + row] * b[column * 4 + 1] + a[8 + row] * b[column * 4 + 2] + a[12 + row] * b[column * 4 + 3];
      }
    }
    return out;
  };
  const identity = () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  const rotateX = angle => new Float32Array([1,0,0,0, 0,Math.cos(angle),Math.sin(angle),0, 0,-Math.sin(angle),Math.cos(angle),0, 0,0,0,1]);
  const rotateY = angle => new Float32Array([Math.cos(angle),0,-Math.sin(angle),0, 0,1,0,0, Math.sin(angle),0,Math.cos(angle),0, 0,0,0,1]);
  const rotateZ = angle => new Float32Array([Math.cos(angle),Math.sin(angle),0,0, -Math.sin(angle),Math.cos(angle),0,0, 0,0,1,0, 0,0,0,1]);
  const scale = amount => new Float32Array([amount,0,0,0, 0,amount,0,0, 0,0,amount,0, 0,0,0,1]);
  const translate = (x, y, z) => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
  const perspective = (fieldOfView, aspect, near, far) => {
    const f = 1 / Math.tan(fieldOfView / 2);
    const range = 1 / (near - far);
    return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(near+far)*range,-1, 0,0,near*far*2*range,0]);
  };

  let yaw = -0.10;
  let pitch = 0.17;
  let velocityX = 0;
  let velocityY = 0;
  let dragging = false;
  let pointerX = 0;
  let pointerY = 0;
  let lastInteraction = performance.now();
  let sceneOffsetX = 0;
  let sceneOffsetY = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fieldOfView = Math.PI / 5.4;
  const cameraDistance = 8.25;

  function resize() {
    const pixelRatio = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.35 : 1.8);
    const width = Math.max(1, Math.floor(canvas.clientWidth * pixelRatio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    if (orbit) {
      const canvasRect = canvas.getBoundingClientRect();
      const orbitRect = orbit.getBoundingClientRect();
      const aspect = canvasRect.width / Math.max(1, canvasRect.height);
      const centerDeltaX = orbitRect.left + orbitRect.width * 0.5 - (canvasRect.left + canvasRect.width * 0.5);
      const centerDeltaY = orbitRect.top + orbitRect.height * 0.5 - (canvasRect.top + canvasRect.height * 0.5);
      const visibleHalfHeight = cameraDistance * Math.tan(fieldOfView * 0.5);
      sceneOffsetX = (centerDeltaX / Math.max(1, canvasRect.width * 0.5)) * visibleHalfHeight * aspect;
      sceneOffsetY = -(centerDeltaY / Math.max(1, canvasRect.height * 0.5)) * visibleHalfHeight;
    }
  }

  function transformPoint(matrix, point) {
    return [
      matrix[0] * point[0] + matrix[4] * point[1] + matrix[8] * point[2] + matrix[12] * point[3],
      matrix[1] * point[0] + matrix[5] * point[1] + matrix[9] * point[2] + matrix[13] * point[3],
      matrix[2] * point[0] + matrix[6] * point[1] + matrix[10] * point[2] + matrix[14] * point[3],
      matrix[3] * point[0] + matrix[7] * point[1] + matrix[11] * point[2] + matrix[15] * point[3]
    ];
  }

  function updateSignal(model, viewProjection) {
    if (!symbol) return;
    const modelViewProjection = multiply(viewProjection, model);
    // A point embedded in the upper body of the arrow, slightly above its front face.
    const anchor = [1.34 - 0.21935, 0.62 - 0.10375, 0.255, 1];
    const clip = transformPoint(modelViewProjection, anchor);
    if (Math.abs(clip[3]) < 0.0001) return;

    const canvasRect = canvas.getBoundingClientRect();
    const symbolRect = symbol.getBoundingClientRect();
    const normalizedX = clip[0] / clip[3];
    const normalizedY = clip[1] / clip[3];
    const anchorX = canvasRect.left - symbolRect.left + (normalizedX * 0.5 + 0.5) * canvasRect.width;
    const anchorY = canvasRect.top - symbolRect.top + (0.5 - normalizedY * 0.5) * canvasRect.height;
    const originX = symbolRect.width * -0.70;
    const originY = symbolRect.height * 0.83;
    const deltaX = anchorX - originX;
    const deltaY = anchorY - originY;

    symbol.style.setProperty('--signal-origin-x', `${originX}px`);
    symbol.style.setProperty('--signal-origin-y', `${originY}px`);
    symbol.style.setProperty('--signal-x', `${anchorX}px`);
    symbol.style.setProperty('--signal-y', `${anchorY}px`);
    symbol.style.setProperty('--signal-length', `${Math.hypot(deltaX, deltaY)}px`);
    symbol.style.setProperty('--signal-angle', `${Math.atan2(deltaY, deltaX)}rad`);
  }

  function render(time) {
    if (document.hidden) { requestAnimationFrame(render); return; }
    resize();
    if (!dragging) {
      yaw += velocityX;
      pitch = Math.max(-1.12, Math.min(1.12, pitch + velocityY));
      velocityX *= 0.93;
      velocityY *= 0.93;
      if (!reducedMotion && time - lastInteraction > 2200) {
        const idleYaw = -0.10 + Math.sin(time * 0.00045) * 0.075;
        const idlePitch = 0.16 + Math.sin(time * 0.00055) * 0.035;
        yaw += (idleYaw - yaw) * 0.018;
        pitch += (idlePitch - pitch) * 0.018;
      }
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9686, 0.9686, 0.9529, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);

    const aspect = canvas.width / canvas.height;
    const projection = perspective(fieldOfView, aspect, 0.1, 50);
    const view = translate(0, 0, -cameraDistance);
    const viewProjection = multiply(projection, view);
    const fit = aspect < 0.8 ? 0.56 : 0.62;
    let model = identity();
    model = multiply(model, rotateX(pitch));
    model = multiply(model, rotateY(yaw));
    model = multiply(model, rotateZ(-0.015));
    model = multiply(model, scale(fit));
    model = multiply(translate(sceneOffsetX, sceneOffsetY, 0), model);
    gl.uniformMatrix4fv(locations.model, false, model);
    gl.uniformMatrix4fv(locations.viewProjection, false, viewProjection);
    updateSignal(model, viewProjection);

    for (const mesh of meshes) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
      gl.enableVertexAttribArray(locations.position);
      gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
      gl.enableVertexAttribArray(locations.normal);
      gl.vertexAttribPointer(locations.normal, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.mix);
      gl.enableVertexAttribArray(locations.mix);
      gl.vertexAttribPointer(locations.mix, 1, gl.FLOAT, false, 0, 0);
      gl.uniform3fv(locations.colorA, mesh.colorA);
      gl.uniform3fv(locations.colorB, mesh.colorB);
      gl.uniform1f(locations.metallic, mesh.metallic);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    }

    if (!host.classList.contains('is-webgl')) host.classList.add('is-webgl');
    requestAnimationFrame(render);
  }

  host.addEventListener('pointerdown', event => {
    dragging = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    velocityX = 0;
    velocityY = 0;
    lastInteraction = performance.now();
    host.setPointerCapture(event.pointerId);
  });
  host.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - pointerX;
    const dy = event.clientY - pointerY;
    const deltaYaw = dx * 0.004;
    const deltaPitch = dy * 0.004;
    velocityX = Math.max(-0.025, Math.min(0.025, deltaYaw));
    velocityY = Math.max(-0.02, Math.min(0.02, deltaPitch));
    yaw += deltaYaw;
    pitch = Math.max(-1.12, Math.min(1.12, pitch + deltaPitch));
    pointerX = event.clientX;
    pointerY = event.clientY;
    lastInteraction = performance.now();
  });
  const release = event => {
    dragging = false;
    lastInteraction = performance.now();
    if (event.pointerId !== undefined && host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
  };
  host.addEventListener('pointerup', release);
  host.addEventListener('pointercancel', release);
  host.addEventListener('keydown', event => {
    const step = 0.12;
    if (event.key === 'ArrowLeft') yaw -= step;
    else if (event.key === 'ArrowRight') yaw += step;
    else if (event.key === 'ArrowUp') pitch = Math.max(-1.12, pitch - step);
    else if (event.key === 'ArrowDown') pitch = Math.min(1.12, pitch + step);
    else return;
    event.preventDefault();
    lastInteraction = performance.now();
  });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    host.classList.remove('is-webgl');
  });

  requestAnimationFrame(render);
})();
