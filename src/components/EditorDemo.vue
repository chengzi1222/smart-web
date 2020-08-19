<template>
	<div>
		<!-- 图片上传组件辅助-->
		<el-upload class="avatar-uploader" :action="serverUrl" name="file" :show-file-list="false"
			:on-success="uploadSuccess" :on-error="uploadError" :data="data_" :before-upload="beforeUpload">
		</el-upload>
		<el-row v-loading="quillUpdateImg">
			<quillEditor v-model="detailContent" ref="myQuillEditor" :options="editorOption"
				@blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"
				@change="onEditorChange($event)">
			</quillEditor>
		</el-row>
	</div>
</template>

<script>
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	import {
		quillEditor
	} from 'vue-quill-editor'

	export default {
		props: ['resetHtml', 'type_'],
		data() {

			// 工具栏配置
			const toolbarOptions = [
				['bold', 'italic', 'underline', 'strike'], // toggled buttons
				['blockquote', 'code-block'],

				[{
					'header': 1
				}, {
					'header': 2
				}], // custom button values
				[{
					'list': 'ordered'
				}, {
					'list': 'bullet'
				}],
				[{
					'script': 'sub'
				}, {
					'script': 'super'
				}], // superscript/subscript
				[{
					'indent': '-1'
				}, {
					'indent': '+1'
				}], // outdent/indent
				[{
					'direction': 'rtl'
				}], // text direction

				[{
					'size': ['small', false, 'large', 'huge']
				}], // custom dropdown
				//	[{ 'header': [1, 2, 3, 4, 5, 6, false] }], //不影响编辑框中导出的内容字体大小
				[{
					'color': []
				}, {
					'background': []
				}], // dropdown with defaults from theme
				[{
					'font': [16, 55, 33, 24]
				}],
				[{
					'align': []
				}],
				['link', 'image', 'videos'],
				['clean'] // remove formatting button
			];
			return {
				data_: {
					type: 'NEWSCONTENT',
					field: 'PHOTO'
				},
				quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
				serverUrl: '/api/newsUpload/img', // 这里写你要上传的图片服务器地址
				header: {
					token: sessionStorage.token
				}, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
				detailContent: '', // 富文本内容
				editorOption: {
					placeholder: '',
					theme: 'snow', // or 'bubble'
					modules: {
						toolbar: {
							container: toolbarOptions, // 工具栏
							handlers: {
								'image': function (value) { //工具栏中图片上传按钮'image'被触发
									if (value) {
										// 触发input框选择图片文件
										document.querySelector('.avatar-uploader input')
									.click(); //找到本vue中的图片上传组件,并触发点击事件
									} else {
										this.quill.format('image', false);
									}
								}
							}
						}
					}
				}
			}
		},
		// manually control the data synchronization
		// 如果需要手动控制数据同步，父组件需要显式地处理changed事件
		methods: {
			onEditorBlur(quill) {
				console.log('editor blur!');
				//console.log('editor blur!', quill)
			},
			onEditorFocus(quill) {
				console.log('editor focus!');
				//console.log('editor focus!', quill)
			},
			onEditorReady(quill, html) {
				console.log('editor ready!');
				//console.log('editor ready!', quill
			},
			onEditorChange({
				quill,
				html,
				text
			}) {
				console.log('editor change!');
				//console.log('editor change!', html)
				// this.detailContent = html;
				this.$emit("EditorChange", html)
			},
			// 图片上传组件上传前方法
			beforeUpload(file) {
				// 显示loading动画
				this.quillUpdateImg = true;
				const type = file.type;
				if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].indexOf(type) == -1) {
					this.$message.error('请选择png、jpg、jpeg、gif格式的图片！');
					// loading动画消失
					this.quillUpdateImg = false;
					return false;
				}
			},
			// 图片上传成功后处理
			uploadSuccess(res, file, fileList) {
				// res为图片服务器返回的数据
				let picFileList = res.data.fileList; //返回的本批次图片文件字段集合
				if (picFileList && picFileList.length > 0) {
					// 将本次上传成功的图片
					let fileId = picFileList[0].fileId; //只看本批次图片的第一张
					let tmpNewsId = picFileList[0].tmpNewsId; //本批次图片的批次id
					console.log("图片地址");
					console.log(fileId);
					// 获取富文本组件实例
					let quill = this.$refs.myQuillEditor.quill;
					// 获取光标所在位置
					let length = quill.getSelection().index;
					// 插入图片  res.info为服务器返回的图片地址
					// quill.insertEmbed(length, 'image', "http://fs-local.ybveg.com/fdfs/" + fileId);
					quill.insertEmbed(length, 'image', this.$store.getters.filePath + fileId);
					// 调整光标到最后
					quill.setSelection(length + 1);
					this.sendContentPicId(picFileList[0].id);
				} else {
					this.$message.error('图片插入失败!')
				}
				// loading动画消失
				this.quillUpdateImg = false
			},

			// 富文本图片上传失败
			uploadError() {
				// loading动画消失
				this.quillUpdateImg = false;
				this.$message.error('图片插入失败!')
			},
			// 向父组件传值，让父组件来负责与资讯（业务）做关联
			sendContentPicId(picId) {
				this.$emit("getPicIdToParent", picId);
			}
		},
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill
			}
		},
		watch: {
			// 回显的值
			resetHtml(val) {
				if (val) {
					this.detailContent = val;
				}
			}
		},
		mounted() {
			console.log('this is current quill instance object')
			// console.log('this is current quill instance object', this.editor)
			if(this.type_=='PXKH'){
				this.data_={
					type: 'PXKH',
					field: 'PHOTO'
				}
			}
		},
		components: {
			quillEditor
		}
	}
</script>
<style lang="scss">
	/*富文本输入框的高度*/
	.editorBox .ql-container.ql-snow {
		min-height: 300px;
	}
</style>