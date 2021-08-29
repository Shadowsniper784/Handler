function replace(text,array) {
  array.forEach(e=>{
    let r = e.name+'="'+e.value+'"'
    if(!e.value) r = ''
  const reg = new RegExp(e.name,'i')
  text = text.replace(reg,r)
  })
  return text
}
function handleEmbed(embed) {
  const { color='',fields=[] } = embed
  let embedContent = `<discord-embed
			slot="embeds"
			color
			title
			url
			thumbnail
			image="{image}"
			footer-image="{footer-image}"
			timestamp="{timestamp}"
			author-name="{author-name}"
			author-image="{author-image}"
			author-url="{author-url}"
		>
			{description}
			<discord-embed-fields slot="fields">
			  {fields}
			</discord-embed-fields>
			<span slot="footer">{footer}</span>
		</discord-embed>
	</discord-message>`
	const fielda = []
	for(let field of fields) {
	 fielda.push(`<discord-embed-field field-title="${field.name||''}" ${field.inline ? 'inline':''}>
				${field.value ? field.value : ''}
			</discord-embed-field>`)
	}
	console.log(replace(embedContent, [{name:'color',value:color},{name:'title',value:title}]))
}
module.exports = {
  callback: async ({ message,text }) => {
    const messages = [...await message.channel.messages.fetch({limit:4})]
    messages.forEach((e,i)=>{
      messages[i] = messages[i][1]
      const msg = messages[i]
      messages[i] = {content:msg.cleanContent, author:msg.member ? msg.member.displayName : msg.author.username,avatar:msg.author.displayAvatarURL(),bot:msg.author.bot}
    })
    console.log(messages[0])
    const string = JSON.stringify(messages)
    handleEmbed(text)
    message.reply({files:[{name:'test.json',attachment:Buffer.from(string)}]})
  }
}