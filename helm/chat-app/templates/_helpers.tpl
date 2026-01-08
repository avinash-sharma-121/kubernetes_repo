{{- define "three-tier.fullname" -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end }}
