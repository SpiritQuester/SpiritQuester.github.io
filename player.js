window.addEventListener("load", (event) => { 
	var plyr = {el: document.getElementById("player"), base_x: "500px", x: "500px", y: "300px", 
		dodge_x: "400px", dodge_spd: 1.5, move_spd: 1, dodge_arrow: document.getElementById("dodge_arrow"),
		hp_el: document.getElementById("player_hp"), step: 1, action_interval: null,
		atk_arrow: document.getElementById("atk_arrow")};
	var enmy = {el: document.getElementById("enemy"), hp_el: document.getElementById("enemy_hp"),
	 base_x: "700px"};
	[plyr.el.style.left, plyr.el.style.top] = [plyr.x, plyr.y];
	var sword = document.getElementById("sword");
	sword.style.visibility = "hidden";

	document.addEventListener("click", function (e) {
		let mouse_x = e.pageX;
		if (plyr.el.style.left != plyr.base_x) //plyr must be at start position
			return;
		if (mouse_x > parseInt(enmy.base_x.replace("px",'') - 64)){
			plyr.step = plyr.move_spd;
			plyr.atk_arrow.style.visibility = "visible";
			plyr.action_interval = setInterval(attack, 5);
		}
		else {
			if (plyr.el.style.left == plyr.base_x)
				dodge_anim();
			plyr.step = plyr.dodge_spd * -1;
			plyr.dodge_arrow.style.visibility = "visible";
			plyr.action_interval = setInterval(dodge, 5);
		}
	});

	setInterval(function swordPosition() {
		let x = parseInt(plyr.x.replace("px",''));
		let y = parseInt(plyr.y.replace("px",''));
		sword.style.top = (y-16).toString() + "px";
		sword.style.left = (x+34).toString() + "px";

		let hit_anim = document.getElementById("plyr_hit_anim");
		hit_anim.style.left = enmy.el.style.left;
		hit_anim.style.top = (parseInt(enmy.el.style.top.replace("px",''))-20).toString()+"px";
	}, 1);

	function attack() {
		let x = parseInt(plyr.x.replace("px",''));
		x += plyr.step;
		plyr.x = plyr.el.style.left = x.toString() + "px";
		let collided = isCollided(attacker=plyr, defender=enmy);
		enmy.hp_el.value = (collided ? enmy.hp_el.value-0.1 : enmy.hp_el.value);
		if (plyr.el.style.left == plyr.base_x) {
			if (plyr.step == -1)
				clearInterval(plyr.action_interval);
			else
				plyr.step = 1;
		}
		else if (plyr.el.style.left == enmy.base_x || collided) {
			plyr.atk_arrow.style.visibility = "hidden";
			plyr.step = -1;
		}

		// if enemy is hit
		if (collided) {
			sword.style.visibility = "visible";
			sword.src = "img/sword_right.gif";
			let swordTimeout = setTimeout(function () {
				sword.style.visibility = "hidden";
				clearTimeout(swordTimeout);
			}, 400);

			let hit_anim = document.getElementById("plyr_hit_anim");
			[hit_anim.src, hit_anim.style.visibility] = ["img/slash_right.gif", "visible"];
			enmy.el.style.filter = "brightness(500%)";
			plyr.el.src = "img/plyr_atk.png";
			let enmyHitFlash = setTimeout(function () {
				enmy.el.style.filter = "brightness(100%)";
				hit_anim.style.visibility = "hidden";
				plyr.el.src = "img/plyr_right.gif";
				clearTimeout(enmyHitFlash);
			}, 400);
		}
	}

	function dodge() {
		let x = parseInt(plyr.x.replace("px",''));
		x += plyr.step;
		plyr.x = plyr.el.style.left = x.toString() + "px";
		if (plyr.el.style.left == plyr.base_x) {
			if (plyr.step == plyr.move_spd) {
				plyr.dodge_arrow.style.visibility = "hidden";
				clearInterval(plyr.action_interval);
			}
			else {
				plyr.step = plyr.dodge_spd * -1;
			}
		}
		else if (plyr.el.style.left <= plyr.dodge_x)
			plyr.step = plyr.move_spd;

		if (plyr.step == (plyr.dodge_spd * -1) && !plyr.el.src.includes("img/plyr_dodge.png"))
			plyr.el.src = "img/plyr_dodge.png";
		else if (plyr.step == plyr.move_spd && !plyr.el.src.includes("img/plyr_right.gif"))
			plyr.el.src = "img/plyr_right.gif";
	}

	function dodge_anim() {
		let dodge_anim = document.createElement("img");
		dodge_anim.src = "img/dodge_dust.gif";
		let blur = 0.5;
		dodge_anim.style.filter = "brightness(150%) sepia(200%) blur(" + blur.toString()+"px)";
		dodge_anim.style.opacity = "0.5";
		dodge_anim.style.left = plyr.dodge_x;
		dodge_anim.style.top = plyr.y;
		document.body.append(dodge_anim);
		var dodgeBlur = setInterval(function () {
			blur += .7;
			dodge_anim.style.filter = "brightness(150%) blur(" + blur.toString()+"px)";
		}, 50);
		var dodgeTimeout = setTimeout(function () {
			dodge_anim.remove();
			clearTimeout(dodgeTimeout);
			clearInterval(dodgeBlur);
		}, 400);

	}

	function isCollided(attacker, defender) {
	  const atk = attacker.el.getBoundingClientRect();
	  const def = defender.el.getBoundingClientRect();
	  // Check for overlap using the rectangles of the elements
	  return !(
	    atk.right < def.left + 48 ||
	    atk.left > def.right ||
	    atk.bottom < def.top ||
	    atk.top > def.bottom
	  );
	}
});