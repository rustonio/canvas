const canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
const submit_button = document.querySelector('button');
const inputs = document.getElementsByTagName('input');
const input_angle_counter = document.getElementById('angle_count');
const input_point_counter = document.getElementById('point_count');
const input_ratio = document.getElementById('ratio');
const clear_button = document.getElementById('clear_button');
const shape_color = document.getElementById('shape_color');
const shape_color2 = document.getElementById('shape_color2');
const checkbox_custom = document.getElementById('isCustom');
const input_point_width = document.getElementById('point_width');
const input_point_height = document.getElementById('point_height');
const input_point_color = document.getElementById('point_color');
const checkbox_gradient = document.getElementById('isGradient');
const checkbox_instant = document.getElementById('isInstant');
const checkbox_point_gradient = document.getElementById('isPointGradient');

let shape = [];
let isCustom = false,isGradient = false,isInstant = false,isPointGradient = false;

async function reload() {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
    submit_button.disabled =false;
    c.restore();
    c.reset();
    c.clearRect(0,0,canvas.width,canvas.height);
    shape=[];
    for (let i = 0; i < 999999; i++) {
        clearTimeout(i);
    }

    //if (parseInt(input_point_counter.value)>=100000) window.location = window.location;
}

function calcCoords(_angle, angle) {
    const piRatio = Math.PI /180;
    let x,y;
    x = Math.round(450 + parseFloat(Math.cos((_angle+angle/2)*piRatio).toFixed(4))*400);
    y = Math.round(450 + parseFloat(Math.sin((_angle+angle/2)*piRatio).toFixed(4))*400);
    //console.log(x,y, Number(Math.cos(_angle*piRatio).toFixed(4)));
    return {x,y}
}

function drawPoints(count) {
    c.clearRect(0,0,canvas.width,canvas.height);
    c.beginPath();
    if (isGradient) {
        let grd=c.createLinearGradient(0,0,900,0);
        grd.addColorStop(0,`${shape_color.value}`);
        grd.addColorStop(1,`${shape_color2.value}`);
        c.fillStyle=grd;
    }
    else c.fillStyle  = `${shape_color.value}`;

    if (isCustom) {
        shape.forEach((coords) => {
            c.lineTo(coords.x,coords.y);
        });
        c.fill();
        return;
    }
    if (count<3) return;
    const center_angle =  Math.floor(360 / count);
    const angle = 180*(count-2)/count;
    const shape_coords = [];

    for (let i = 0; i < 360; i++) {
        if (i%center_angle !== 0) continue;
        let coords = calcCoords(i, angle);
        shape_coords.push(coords);
    }
    if (count !== shape_coords.length) {
        shape_coords.pop();
    }
    shape_coords.forEach((coords) => {
        c.lineTo(coords.x,coords.y);
    });
    c.fill();
    shape = shape_coords.slice();
}

function setFirstPoint() {
    let x = Math.floor(Math.random() * 800) + 50;
    let y = Math.floor(Math.random() * 800) + 50;
    return {x, y};
}
async function drawStart(point_count, ratio) {
    c.fillStyle = `rgb(0,0,0)`;
    let vertex = shape[Math.floor(Math.random()*shape.length)];
    let previousPoint,currentPoint;
    do  {
        currentPoint = setFirstPoint();
    } while(!c.isPointInPath(currentPoint.x,currentPoint.y));
    let i=0;
    if (isInstant) {
        for (let i = 0; i < point_count; i++) {
            c.fillStyle = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
            c.fillRect(currentPoint.x, currentPoint.y, parseInt(input_point_width.value), parseInt(input_point_height.value));
            vertex = shape[Math.floor(Math.random() * shape.length)];
            previousPoint = {...currentPoint};
            currentPoint = {
                x:  (vertex.x + previousPoint.x*ratio.n/ratio.m)/(1+ratio.n/ratio.m),
                y: (vertex.y + previousPoint.y*ratio.n/ratio.m)/(1+ratio.n/ratio.m)
            }
        }
    }
    else {
        for (let i = 0; i < point_count; i++) {
            setTimeout(() => {
                if (isPointGradient) {
                    c.fillStyle = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
                }
                else c.fillStyle=`${input_point_color.value}`;

                c.fillRect(currentPoint.x, currentPoint.y, parseInt(input_point_width.value), parseInt(input_point_height.value));
                vertex = shape[Math.floor(Math.random() * shape.length)];
                previousPoint = {...currentPoint};
                currentPoint = {
                    x:  (vertex.x + previousPoint.x*ratio.n/ratio.m)/(1+ratio.n/ratio.m),
                    y: (vertex.y + previousPoint.y*ratio.n/ratio.m)/(1+ratio.n/ratio.m)
                }
            },1);
        }
    }


}

input_point_counter.addEventListener('input', () => {
    if (parseInt(input_point_counter.value)>=100000) {
        document.getElementsByClassName('message')[0].textContent = 'большое количество точек может влиять на производительность';
    }else {document.getElementsByClassName('message')[0].textContent = '';}
})
submit_button.addEventListener('click', ()=> {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
    submit_button.disabled = true;
    drawPoints(parseInt(input_angle_counter.value));
    if (!shape.length) return;
    drawStart(parseInt(input_point_counter.value),{
        n:parseInt(input_ratio.value[0]),
        m:parseInt(input_ratio.value[2])
    });
});
clear_button.addEventListener('click', reload);
canvas.addEventListener('click', (e) => {
    if (!isCustom) return;
    shape.push({
        x:e.x,
        y:e.y
    });
    c.fillRect(e.x,e.y,3,3);
})
checkbox_custom.addEventListener('change', () => {isCustom = checkbox_custom.checked});
checkbox_gradient.addEventListener('change', () => {
    isGradient = checkbox_gradient.checked;
    shape_color2.classList.toggle('hidden');
});
checkbox_instant.addEventListener('change', () => {isInstant = checkbox_instant.checked;});
checkbox_point_gradient.addEventListener('change', () => {isPointGradient = checkbox_point_gradient.checked})