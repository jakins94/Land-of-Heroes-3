// Inventory.js controls the character inventory UI
//test
// inventory variables
var inventoryOpen = false,
    invWidth = (this.game.camera.view.width / 3),
    invHeight = this.game.camera.view.height,
    invStartX = (this.game.camera.view.width - invWidth) + 2,
    invAlpha = 0.5,

// stat box and stat text variables
    statBoxWidth = invWidth - 20,
    statBoxHeight = 125,
    statStartX = invStartX + 10,
    statStartY = 200,
    statSpacingY = 15,
    statShadowDistX = 1,
    statShadowDistY = 1,
    statShadowBlur = 1,
    statAnchorX = 0,
    statAnchorY = 0,
    statAlpha = 0.5,

// name box variables
    nameBoxWidth = invWidth - 20,
    nameBoxHeight = 30,
    nameBoxStartX = invStartX + 10,
    nameBoxStartY = 10,

// item box variables
    itemStartX = statStartX - 2,
    itemStartY = statStartY + statBoxHeight + 10,
    itemWidth = 32,
    itemHeight = 32,
    itemSpacing = 4,
    itemSlots = 36,

// equipment box variables
    equipWidth = 32,
    equipHeight = 32,
    equipSpacing = 8,
    equipStartX = invStartX - equipSpacing - equipWidth + (invWidth / 2) - 15,
    equipStartY = 60;
    var equipSlots;


// placeholder stats
var maxHP           = Math.round(Math.random() * 600),
    HP              = maxHP,
    maxMP           = Math.round(Math.random() * 600),
    MP              = maxMP,
    strength        = Math.round(Math.random() * 120),
    dexterity       = Math.round(Math.random() * 120),
    intelligence    = Math.round(Math.random() * 120);


    var itemSlotShadow = [],
        itemSlot = [],
        equipSlotShadow = [],
        equipSlot = [];


function startInventory() {

	equipSlots = [
        [ equipStartX, equipStartY ],
        [ equipStartX + equipWidth + equipSpacing, equipStartY ],
        [ equipStartX + ((equipWidth + equipSpacing) * 2), equipStartY ],
        [ equipStartX, equipStartY + (equipHeight + equipSpacing)],
        [ equipStartX + ((equipWidth + equipSpacing)), equipStartY + (equipHeight + equipSpacing) ],
        [ equipStartX + ((equipWidth + equipSpacing) * 2), equipStartY + (equipHeight + equipSpacing) ],
        [ equipStartX, equipStartY + ((equipHeight + equipSpacing)*2)],
        [ equipStartX + ((equipWidth + equipSpacing)), equipStartY + ((equipHeight + equipSpacing)*2) ],
        [ equipStartX + ((equipWidth + equipSpacing) * 2), equipStartY + ((equipHeight + equipSpacing)*2) ]
    ];

	// Equip slots
	var bmd = game.add.bitmapData(equipWidth, equipHeight);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, equipWidth, equipHeight);
		bmd.ctx.fillStyle = '#FFFFFF';
		bmd.ctx.fill();

		for(var i=0;i<equipSlots.length;i++) {

			equipSlotShadow[i] = game.add.sprite(equipSlots[i][0] + 2, equipSlots[i][1] + 2, bmd);
			equipSlotShadow[i].tint = 0x000000;
	    	equipSlotShadow[i].alpha = 0;
	    	equipSlotShadow[i].fixedToCamera = true;
			equipSlot[i] = game.add.sprite(equipSlots[i][0], equipSlots[i][1], bmd);
			equipSlot[i].alpha = 0;
			equipSlot[i].fixedToCamera = true;

			equipSlot[i].inputEnabled = true;

		}



	// Item slots
		bmd = game.add.bitmapData(itemWidth, itemHeight);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, itemWidth, itemHeight);
		bmd.ctx.fillStyle = '#FFFFFF';
		bmd.ctx.fill();

		
		var currSlotX = itemStartX,
			currSlotY = itemStartY;
		for(var i=0;i<itemSlots;i++) {
			if(currSlotX >= this.game.camera.view.width - 32) {
				currSlotX = itemStartX;
				currSlotY += itemSpacing + itemHeight;
			}
			itemSlotShadow[i] = game.add.sprite(currSlotX + 2, currSlotY + 2, bmd);
			itemSlotShadow[i].tint = 0x000000;
	    	itemSlotShadow[i].alpha = 0;
	    	itemSlotShadow[i].fixedToCamera = true;
			itemSlot[i] = game.add.sprite(currSlotX, currSlotY, bmd);
			itemSlot[i].alpha = 0;
			itemSlot[i].fixedToCamera = true;
			
			itemSlot[i].inputEnabled = true;

			currSlotX += itemSpacing + itemWidth;
		}

	// Inventory Square
		bmd = game.add.bitmapData(invWidth, invHeight);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, invWidth, invHeight);
		bmd.ctx.fillStyle = '#666666';
		bmd.ctx.fill();
		invObject = game.add.sprite(invStartX, 0, bmd);
		invObject.alpha = 0;
		invObject.fixedToCamera = true;

	// Name square
		bmd = game.add.bitmapData(nameBoxWidth, nameBoxHeight);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, nameBoxWidth, nameBoxHeight);
		bmd.ctx.fillStyle = '#FFFFFF';
		bmd.ctx.fill();
		nameBoxShadow = game.add.sprite(nameBoxStartX, nameBoxStartY - 1, bmd);
		nameBoxShadow.tint = 0x000000;
    	nameBoxShadow.alpha = 0;
    	nameBoxShadow.fixedToCamera = true;
		nameBoxObject = game.add.sprite(nameBoxStartX - 2, nameBoxStartY - 3, bmd);
		nameBoxObject.alpha = 0;
		nameBoxObject.fixedToCamera = true;

	// Stat square
		bmd = game.add.bitmapData(statBoxWidth, statBoxHeight);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, statBoxWidth, statBoxHeight);
		bmd.ctx.fillStyle = '#FFFFFF';
		bmd.ctx.fill();
		statShadow = game.add.sprite(statStartX, statStartY - 1, bmd);
		statShadow.tint = 0x000000;
    	statShadow.alpha = 0;
    	statShadow.fixedToCamera = true;
		statObject = game.add.sprite(statStartX - 2, statStartY - 3, bmd);
		statObject.alpha = 0;
		statObject.fixedToCamera = true;


// Player name displayed
	var invNameStyle = { font: "bold 24px Arial", fill: "white", align: "center" };
		invName = game.add.text(invStartX + (invWidth / 2), 8, myName, invNameStyle);
		invName.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
		invName.anchor.setTo(0.5, 0);
		invName.alpha = 0;
		invName.fixedToCamera = true;

// Player stats
	var invStatStyle = { font: "bold 14px Arial", fill: "white" };

	statsText = game.add.text(statStartX + (statBoxWidth / 2), statStartY + 3, "Stats", invStatStyle);
		statsText.alpha = 0;
		statsText.fixedToCamera = true;
		statsText.setShadow(statShadowDistX, statShadowDistY, 'rgba(0,0,0,0.5)', statShadowBlur);
		statsText.anchor.setTo(0.5, statAnchorY);

	hpText = game.add.text(statStartX + 3, statStartY + 15, "Health: " + HP + " / " + maxHP, invStatStyle);
		hpText.alpha = 0;
		hpText.fixedToCamera = true;
		hpText.setShadow(statShadowDistX, statShadowDistY, 'rgba(0,0,0,0.5)', statShadowBlur);
		hpText.anchor.setTo(statAnchorX, statAnchorY);

	mpText = game.add.text(statStartX + 3, statStartY + 15 + (statSpacingY), "Mana: " + MP + " / " + maxMP, invStatStyle);
		mpText.alpha = 0;
		mpText.fixedToCamera = true;
		mpText.setShadow(statShadowDistX, statShadowDistY, 'rgba(0,0,0,0.5)', statShadowBlur);
		mpText.anchor.setTo(statAnchorX, statAnchorY);

	strengthText = game.add.text(statStartX + 3, statStartY + 15 + (statSpacingY*2), "Strength: " + strength, invStatStyle);
		strengthText.alpha = 0;
		strengthText.fixedToCamera = true;
		strengthText.setShadow(statShadowDistX, statShadowDistY, 'rgba(0,0,0,0.5)', statShadowBlur);
		strengthText.anchor.setTo(statAnchorX, statAnchorY);

	dexterityText = game.add.text(statStartX + 3, statStartY + 15 + (statSpacingY*3), "Dexterity: " + dexterity, invStatStyle);
		dexterityText.alpha = 0;
		dexterityText.fixedToCamera = true;
		dexterityText.setShadow(statShadowDistX, statShadowDistY, 'rgba(0,0,0,0.5)', statShadowBlur);
		dexterityText.anchor.setTo(statAnchorX, statAnchorY);

	intelligenceText = game.add.text(statStartX + 3, statStartY + 15 + (statSpacingY*4), "Intelligence: " + intelligence, invStatStyle);
		intelligenceText.alpha = 0;
		intelligenceText.fixedToCamera = true;
		intelligenceText.setShadow(statShadowDistX, statShadowDistY, 'rgba(0,0,0,0.5)', statShadowBlur);
		intelligenceText.anchor.setTo(statAnchorX, statAnchorY);






	group1.add(invObject);

	for(var i=0;i<itemSlots;i++) {
		group1.add(itemSlot[i]);
		group1.add(itemSlotShadow[i]);
	}
	for(var i=0;i<equipSlots.length;i++) {
		group1.add(equipSlot[i]);
		group1.add(equipSlotShadow[i]);
	}
	group1.add(statObject);
	group1.add(statShadow);
	group1.add(nameBoxObject);
	group1.add(nameBoxShadow);
	group1.add(invName);

	group1.add(statsText);
	group1.add(hpText);
	group1.add(mpText);
	group1.add(strengthText);
	group1.add(dexterityText);
	group1.add(intelligenceText);


}



function toggleInventory() {

	if(inventoryOpen) {
		inventoryOpen = false;
		invObject.alpha = 0;
		statObject.alpha = 0;
		statShadow.alpha = 0;
		nameBoxObject.alpha = 0;
		nameBoxShadow.alpha = 0;
		invName.alpha = 0;
		statsText.alpha = 0;
		hpText.alpha = 0;
		mpText.alpha = 0;
		strengthText.alpha = 0;
		dexterityText.alpha = 0;
		intelligenceText.alpha = 0;
		for(var i=0;i<itemSlots;i++) {
			itemSlotShadow[i].alpha = 0;
			itemSlot[i].alpha = 0;
		}
		for(var i=0;i<equipSlots.length;i++) {
			equipSlotShadow[i].alpha = 0;
			equipSlot[i].alpha = 0;
		}
	} else {
		inventoryOpen = true;
		invName.alpha = 0.8;
		statsText.alpha = 0.8;
		hpText.alpha = 0.8;
		mpText.alpha = 0.8;
		strengthText.alpha = 0.8;
		dexterityText.alpha = 0.8;
		intelligenceText.alpha = 0.8;
		invObject.alpha = invAlpha;
		statObject.alpha = statAlpha;
		statShadow.alpha = statAlpha;
		nameBoxObject.alpha = statAlpha;
		nameBoxShadow.alpha = statAlpha;
		for(var i=0;i<itemSlots;i++) {
			itemSlotShadow[i].alpha = statAlpha;
			itemSlot[i].alpha = statAlpha;
		}
		for(var i=0;i<equipSlots.length;i++) {
			equipSlotShadow[i].alpha = statAlpha;
			equipSlot[i].alpha = statAlpha;
		}

	}

}